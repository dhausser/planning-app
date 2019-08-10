import React from 'react';
import { withRouter } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { Loading, Error } from '..';
import LoginForm from './LoginForm';

const LOGIN_USER = gql`
  mutation login {
    login
  }
`;

function Login({ history }) {
  const client = useApolloClient();
  const [login, { loading, error }] = useMutation(
    LOGIN_USER,
    {
      onCompleted: () => {
        localStorage.setItem('token', login);
        client.writeData({ data: { isLoggedIn: true } });
        history.push('/');
      },
    },
  );

  if (loading) return <Loading />;
  if (error) return <Error />;

  return <LoginForm login={login} />;
}

Login.defaultProps = {
  history: null,
};

Login.propTypes = {
  history: PropTypes.objectOf,
};

export default withRouter(Login);
