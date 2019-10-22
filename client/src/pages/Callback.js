import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

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
  return <p>Logging in...</p>;
}

export default Login;
