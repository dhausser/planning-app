import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import { NavigationProvider, withNavigationViewController, LayoutManagerWithViewController } from '@atlaskit/navigation-next';
import '@atlaskit/css-reset';

import client from './apolloClient';
import Pages from './pages';
import Login from './pages/Login';
import GlobalNavigation from './components/Nav/GlobalNavigation';
import productHomeView from './components/Nav/ProductHomeView';
import productIssuesView from './components/Nav/ProductIssuesView';
import projectHomeView from './components/Nav/ProjectHomeView';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function App({ navigationViewController }) {
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
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
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
