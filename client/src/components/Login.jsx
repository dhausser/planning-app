import React from 'react';
import gql from 'graphql-tag';
import { ApolloConsumer, Mutation } from 'react-apollo';
import { LoginForm, Loading } from '.';

const LOGIN_USER = gql`
  mutation login {
    login {
      token,
      tokenSecret
    }
  }
`;

function Login() {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({ login }) => {
            localStorage.setItem('token', login.token);
            localStorage.setItem('tokenSecret', login.tokenSecret);
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
