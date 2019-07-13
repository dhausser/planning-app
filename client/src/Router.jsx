import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { withNavigationViewController, LayoutManagerWithViewController } from '@atlaskit/navigation-next';
import {
  GlobalNavigation,
  ProductHomeView,
  ProductIssuesView,
  ProjectHomeView,
  Login,
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
} from './components';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function Router({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.addView(ProductHomeView);
    navigationViewController.addView(ProductIssuesView);
    navigationViewController.addView(ProjectHomeView);
  }, [navigationViewController]);

  const { data } = useQuery(IS_LOGGED_IN);

  return (
    <BrowserRouter>
      <LayoutManagerWithViewController globalNavigation={GlobalNavigation}>
        {data.isLoggedIn ? (
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
        ) : <Login />
      }
      </LayoutManagerWithViewController>
    </BrowserRouter>
  );
}

Router.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Router);
