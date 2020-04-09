import React, { ReactElement } from 'react';
import { useApolloClient, useMutation, gql } from '@apollo/client';

const LOGIN_USER = gql`
  mutation login {
    login
  }
`;

function LoginMutation(): ReactElement {
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
  return <div />;
}

export default LoginMutation;
