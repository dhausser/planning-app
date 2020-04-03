import React, { useEffect, FunctionComponent } from 'react';
import { ApolloProvider } from '@apollo/client';
import {
  NavigationProvider,
  withNavigationViewController,
  LayoutManagerWithViewController,
} from '@atlaskit/navigation-next';
import '@atlaskit/css-reset';

import Pages from './pages';
import Login from './pages/Login';
import {
  GlobalNav,
  productHomeView,
  productIssuesView,
  projectHomeView,
} from './components/nav';

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
    <LayoutManagerWithViewController globalNavigation={GlobalNav}>
      {isLoggedIn ? <Pages /> : <Login />}
    </LayoutManagerWithViewController>
  );
};

const AppWithNavigationViewController = withNavigationViewController(AppRouter);

const App: FunctionComponent = () => (
  <ApolloProvider client={client}>
    <NavigationProvider>
      <AppWithNavigationViewController />
    </NavigationProvider>
  </ApolloProvider>
);

export default App;
