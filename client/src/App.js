import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import {
  NavigationProvider,
  withNavigationViewController,
  LayoutManagerWithViewController,
} from '@atlaskit/navigation-next';

import GlobalNavigation from './components/Nav/GlobalNavigation';
import ProductHomeView from './components/Nav/ProductHomeView';
import ProductIssuesView from './components/Nav/ProductIssuesView';
import ProjectHomeView from './components/Nav/ProjectHomeView';
import Dashboard from './components/Dashboard/Dashboard';
import Resource from './components/Resource/Resource';
import Resources from './components/Resources';
import Roadmap from './components/Roadmap/Roadmap';
import Issues from './components/Issues/Issues';
import SingleIssue from './components/Issue/SingleIssue';
import Projects from './components/Projects';
import Backlog from './components/Backlog';
import Releases from './components/Releases';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login/Login';

import client from './apollo';

const IS_LOGGED_IN = gql`
  query isUserLoggedIn {
    isLoggedIn @client
  }
`;

const AppRouter = () => (
  <LayoutManagerWithViewController globalNavigation={GlobalNavigation}>
    <Switch>
      <Route path="/dashboards" component={Dashboard} />
      <Route path="/reports" component={Reports} />
      <Route path="/issues" component={Issues} />
      <Route path="/settings" component={Settings} />
      <Route path="/releases" component={Releases} />
      <Route path="/resources" component={Resources} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/backlog" component={Backlog} />
      <Route path="/resource/:resourceId" component={Resource} />
      <Route path="/issue/:issueId" component={SingleIssue} />
      <Route path="/issues/:filterId" component={Issues} />
      <Route path="/" exact component={Projects} />
    </Switch>
  </LayoutManagerWithViewController>
);

function App({ navigationViewController }) {
  const { data } = useQuery(IS_LOGGED_IN);

  useEffect(() => {
    navigationViewController.addView(ProductHomeView);
    navigationViewController.addView(ProductIssuesView);
    navigationViewController.addView(ProjectHomeView);
  }, [navigationViewController]);

  return data.isLoggedIn ? <AppRouter /> : <Login />;
}

App.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

const AppWithNavigationViewController = withNavigationViewController(App);

export default () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <NavigationProvider>
        <AppWithNavigationViewController />
      </NavigationProvider>
    </BrowserRouter>
  </ApolloProvider>
);
