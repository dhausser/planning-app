import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
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

function Login({ history, navigationViewController }) {
  const client = useApolloClient();
  const [login, { loading, error, data }] = useMutation(
    LOGIN_USER,
    {
      onCompleted: ({ login: token }) => {
        localStorage.setItem('token', token);
        client.writeData({ data: { isLoggedIn: true } });

        /**
         * TODO: Fix the onComplete login sequence
         */
        history.push('/');
        window.location.reload();
      },
    },
  );

  useEffect(() => {
    navigationViewController.setView(ProductHomeView.id);
  }, [navigationViewController]);

  if (loading) return <Loading />;
  if (error) return <Error />;

  return <LoginForm login={login} data={data} />;
}

Login.defaultProps = {
  history: null,
};

Login.propTypes = {
  history: PropTypes.func,
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(withRouter(Login));
