import React from 'react';
import gql from 'graphql-tag';
import { ApolloConsumer, Mutation } from 'react-apollo';
import { LoginForm, Loading } from '../components';

const LOGIN_USER = gql`
  mutation login {
    login
  }
`;

function Login() {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({ login }) => {
            localStorage.setItem('token', login);
            client.writeData({ data: { isLoggedIn: true } });
          }}
        >
          {(login, { loading, error }) => {
            if (loading) return <Loading />;
            if (error) return <p>An error occurred</p>;

            return <LoginForm login={login} />;
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
}

export default Login;
