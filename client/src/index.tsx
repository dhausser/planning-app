import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import {
  NavigationProvider,
  withNavigationViewController,
  LayoutManagerWithViewController,
} from '@atlaskit/navigation-next';
import '@atlaskit/css-reset';

import client from './apollo-client';
import Pages from './pages';
import Login from './pages/login';
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

const AppWithNavigationViewController = withNavigationViewController(App);

ReactDOM.render(
  <ApolloProvider client={client}>
    <NavigationProvider>
      <AppWithNavigationViewController />
    </NavigationProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
