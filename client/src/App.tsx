import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import {
  withNavigationViewController,
  LayoutManagerWithViewController,
} from '@atlaskit/navigation-next';
import '@atlaskit/css-reset';

import Pages from './pages';
import Login from './pages/Login';
import {
  IS_LOGGED_IN,
  GlobalNavigation,
  productHomeView,
  productIssuesView,
  projectHomeView,
} from './components/nav';

interface NavigationViewController {
  navigationViewController: {
    setView: (name: object) => void;
    addView: (name: object) => void;
  };
}

function App({
  navigationViewController,
}: NavigationViewController): React.ReactElement {
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
