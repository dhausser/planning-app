import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';

import { withNavigationViewController } from '@atlaskit/navigation-next';
import {
  ProductHomeView,
  Loading,
  Error,
  LoginForm,
} from '../components';

export const LOGIN_USER = gql`
  mutation login {
    login
  }
`;

function Login({ navigationViewController }) {
  useRouteMatch('/login');

  useEffect(() => {
    navigationViewController.setView(ProductHomeView.id);
  }, [navigationViewController]);

  const client = useApolloClient();

  const [login, { loading, error, data }] = useMutation(
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


  if (loading) return <Loading />;
  if (error) return <Error />;

  return <LoginForm login={login} data={data} />;
}

Login.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Login);
