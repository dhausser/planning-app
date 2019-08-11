import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { withNavigationViewController, LayoutManagerWithViewController } from '@atlaskit/navigation-next';
import productHomeView from './components/Nav/ProductHomeView';
import productIssuesView from './components/Nav/ProductIssuesView';
import projectHomeView from './components/Nav/ProjectHomeView';
import GlobalNavigation from './components/Nav/GlobalNavigation';
import Dashboard from './components/Dashboard/Dashboard';
import Resource from './components/Resource/Resource';
import Resources from './components/Resources';
import Roadmap from './components/Roadmap/Roadmap';
import Issues from './components/Issues/Issues';
import SingleIssue from './components/Issue/SingleIssue';
import Projects from './components/Projects';
import Backlog from './components/Backlog';
import Releases from './components/Releases';
import Board from './components/Board';
import Pages from './components/Pages';
import AddItem from './components/AddItem';
import Settings from './components/Settings';
import Login from './components/Login/Login';

const IS_LOGGED_IN = gql`
  query isUserLoggedIn {
    isLoggedIn @client
  }
`;

function Router({ navigationViewController }) {
  const { data } = useQuery(IS_LOGGED_IN);

  useEffect(() => {
    navigationViewController.addView(productHomeView);
    navigationViewController.addView(productIssuesView);
    navigationViewController.addView(projectHomeView);
  }, [navigationViewController]);

  return (
    <LayoutManagerWithViewController globalNavigation={GlobalNavigation}>
      {data.isLoggedIn ? (
        <>
          <Route path="/resource/:resourceId" component={Resource} />
          <Route path="/issue/:issueId" component={SingleIssue} />
          <Route path="/settings" component={Settings} />
          <Route path="/reports" component={Dashboard} />
          <Route path="/releases" component={Releases} />
          <Route path="/backlog" component={Backlog} />
          <Route path="/board" component={Board} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/resources" component={Resources} />
          <Route path="/issues" component={Issues} />
          <Route path="/dashboards" component={Dashboard} />
          <Route path="/pages" component={Pages} />
          <Route path="/AddItem" component={AddItem} />
          <Route path="/" exact component={Projects} />
        </>
      ) : <Login />}
    </LayoutManagerWithViewController>
  );
}
Router.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Router);
