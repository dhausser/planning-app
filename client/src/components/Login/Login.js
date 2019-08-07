import React from 'react';
import { withRouter } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { Loading, Error } from '..';
import LoginForm from './LoginForm';

const LOGIN_USER = gql`
  mutation loginUser {
    loginUser
  }
`;

function Login({ history }) {
  const client = useApolloClient();
  const [loginUser, { loading, error, data }] = useMutation(LOGIN_USER, {
    onCompleted: () => {
      localStorage.setItem('token', loginUser);
      client.writeData({ data: { isLoggedIn: true } });
      history.push('/');
    },
  });

  if (error) return <Error />;
  if (loading || !data) return <Loading />;

  return <LoginForm login={loginUser} data={data} />;
}

Login.defaultProps = {
  history: null,
};

Login.propTypes = {
  history: PropTypes.objectOf,
};

export default withRouter(Login);
