import { RouteComponentProps } from '@reach/router';
import { useApolloClient, useMutation, gql } from '@apollo/client';
import { FunctionComponent } from 'react';

const LOGIN_USER = gql`
  mutation login {
    login
  }
`;

const LoginMutation: FunctionComponent<RouteComponentProps> = () => {
  const client = useApolloClient();
  const [login] = useMutation(LOGIN_USER, {
    onCompleted: ({ login: token }) => {
      localStorage.setItem('token', token);
      client.writeQuery({
        query: gql`
          {
            isLoggedIn
          }
        `,
        data: { isLoggedIn: true },
      });
      window.opener.location.reload();
      window.close();
    },
  });
  login();
  return null;
};

export default LoginMutation;
