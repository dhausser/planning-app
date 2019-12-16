import { useRouteMatch } from 'react-router-dom';
import { useApolloClient, useMutation, gql } from '@apollo/client';

const LOGIN_USER = gql`
  mutation login {
    login
  }
`;

function Login() {
  useRouteMatch('/login');
  const client = useApolloClient();
  const [login] = useMutation(
    LOGIN_USER,
    {
      onCompleted: ({ login: token }) => {
        localStorage.setItem('token', token);
        client.writeData({ data: { isLoggedIn: true } });
        window.opener.location.reload();
        window.close();
      },
    },
  );
  login();
  return null;
}

export default Login;
