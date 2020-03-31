import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import {
  withNavigationViewController,
  LayoutManagerWithViewController,
} from '@atlaskit/navigation-next';
import '@atlaskit/css-reset';

import Pages from './pages';
import Login from './pages/Login';
import {
  GlobalNavigation,
  productHomeView,
  productIssuesView,
  projectHomeView,
} from './components/nav';

interface NavigationViewController {
  navigationViewController: any;
}

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function App({ navigationViewController }: NavigationViewController) {
  const { data } = useQuery(IS_LOGGED_IN);
  useEffect(() => {
    navigationViewController.addView(productHomeView);
    navigationViewController.addView(productIssuesView);
    navigationViewController.addView(projectHomeView);
  }, [navigationViewController]);
  return (
    <LayoutManagerWithViewController globalNavigation={GlobalNavigation}>
      {data.isLoggedIn ? <Pages /> : <Login />}
    </LayoutManagerWithViewController>
  );
}

App.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withNavigationViewController(App);
