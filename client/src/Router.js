import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withNavigationViewController, LayoutManagerWithViewController } from '@atlaskit/navigation-next';
import Page from '@atlaskit/page';
import { gridSize } from '@atlaskit/theme';
import styled from 'styled-components';

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


const Padding = styled.div`
  margin: 0px 40px;
  padding-bottom: ${gridSize() * 3}px;
`;

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
    <Page>
      <Padding>
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
                <Route path="/backlog" component={Backlog} />
                <Route path="/resource/:resourceId" component={Resource} />
                <Route path="/issue/:issueId" component={SingleIssue} />
                <Route path="/issues/:filterId" component={Issues} />
              </Switch>
            ) : <Login />
      }
          </LayoutManagerWithViewController>
        </BrowserRouter>
      </Padding>
    </Page>
  );
}

Router.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Router);
