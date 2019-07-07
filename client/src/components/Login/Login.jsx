import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { ApolloConsumer, Mutation } from 'react-apollo';
import { Loading } from '..';
import LoginForm from './LoginForm';

const LOGIN_USER = gql`
  mutation loginUser {
    loginUser
  }
`;

function Login({ history }) {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({ loginUser }) => {
            localStorage.setItem('token', loginUser);
            client.writeData({ data: { isLoggedIn: true } });
            history.push('/');
          }}
        >
          {(loginUser, { loading, error }) => {
            if (loading) return <Loading />;
            if (error) return <p>An error occurred</p>;

            return <LoginForm login={loginUser} />;
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
}

Login.defaultProps = {
  history: null,
};

Login.propTypes = {
  history: PropTypes.objectOf,
};

export default Login;
