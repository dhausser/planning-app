import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  LayoutManagerWithViewController,
  NavigationProvider,
  withNavigationViewController,
} from '@atlaskit/navigation-next';

import {
  GlobalNavigation,
  ProductHomeView,
  ProductIssuesView,
  ProjectHomeView,
} from './components';

import {
  Dashboard,
  Portfolio,
  Roadmap,
  Backlog,
  Resource,
  Resources,
  Issue,
  Issues,
  Reports,
  Releases,
  Settings,
  Projects,
} from './pages';

const App = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.addView(ProductHomeView);
    navigationViewController.addView(ProductIssuesView);
    navigationViewController.addView(ProjectHomeView);
  }, [navigationViewController]);

  return (
    <LayoutManagerWithViewController globalNavigation={GlobalNavigation}>
      <Switch>
        <Route path="/" exact component={Projects} />
        <Route path="/dashboards" component={Dashboard} />
        <Route path="/reports" component={Reports} />
        <Route path="/issues" component={Issues} />
        <Route path="/settings" component={Settings} />
        <Route path="/releases" component={Releases} />
        <Route path="/resources" component={Resources} />
        <Route path="/roadmap" component={Roadmap} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/backlog" component={Backlog} />
        <Route path="/resource/:resourceId" component={Resource} />
        <Route path="/issue/:issueId" component={Issue} />
        <Route path="/issues/:filterId" component={Issues} />
      </Switch>
    </LayoutManagerWithViewController>
  );
};
const AppWithNavigationViewController = withNavigationViewController(App);

App.propTypes = {
  navigationViewController: PropTypes.func.isRequired,
};

export default () => (
  <NavigationProvider>
    <AppWithNavigationViewController />
  </NavigationProvider>
);
