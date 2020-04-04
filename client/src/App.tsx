import React, { useEffect, FunctionComponent } from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  NavigationProvider,
  withNavigationViewController,
  LayoutManagerWithViewController,
} from '@atlaskit/navigation-next';

import Pages from './pages';
import Login from './pages/Login';

import {
  MyGlobalNavigation,
  productHomeView,
  productIssuesView,
  projectHomeView,
} from './components/Navigation';

import client from './apollo';
import { useUserLogin } from './lib/useUser';

interface NavigationViewController {
  navigationViewController: {
    setView: (name: object) => void;
    addView: (name: object) => void;
  };
}

const AppRouter: FunctionComponent<NavigationViewController> = ({
  navigationViewController,
}) => {
  const isLoggedIn = useUserLogin();

  useEffect(() => {
    navigationViewController.addView(productHomeView);
    navigationViewController.addView(productIssuesView);
    navigationViewController.addView(projectHomeView);
  }, [navigationViewController]);

  return (
    <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
      {isLoggedIn ? <Pages /> : <Login />}
    </LayoutManagerWithViewController>
  );
};

const AppWithNavigationViewController = withNavigationViewController(AppRouter);

const App: FunctionComponent = () => (
  <ApolloProvider client={client}>
    <Router>
      <NavigationProvider>
        <AppWithNavigationViewController />
      </NavigationProvider>
    </Router>
  </ApolloProvider>
);

export default App;
