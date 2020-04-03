import React, { useEffect, FunctionComponent } from 'react';
import {
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
import { useUserLogin } from './lib/useUser';

interface NavigationViewController {
  navigationViewController: {
    setView: (name: object) => void;
    addView: (name: object) => void;
  };
}

// const App: FunctionComponent<NavigationViewController> = ({
//   navigationViewController,
// }) => {

const App: FunctionComponent<NavigationViewController> = () => {
  // const isLoggedIn = useUserLogin();

  // useEffect(() => {
  //   navigationViewController.addView(productHomeView);
  //   navigationViewController.addView(productIssuesView);
  //   navigationViewController.addView(projectHomeView);
  // }, [navigationViewController]);

  return (
    // <LayoutManagerWithViewController globalNavigation={GlobalNav}>
    <LayoutManagerWithViewController>
      <div>Hello</div>
      {/* {isLoggedIn ? <Pages /> : <Login />} */}
    </LayoutManagerWithViewController>
  );
};

export default withNavigationViewController(App);

// eslint-disable-next-line react/display-name
// export default (): JSX.Element => <AppWithNavigationViewController />;

// export default () => (
//   <NavigationProvider>
//     <AppWithNavigationViewController />
//   </NavigationProvider>
// );
