import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withNavigationViewController, LayoutManagerWithViewController } from '@atlaskit/navigation-next';
import Page from '@atlaskit/page';
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
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0px 0px 0px 40px;
  height: 100vh;
  overflow: hidden;
`;

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function App({ navigationViewController }) {
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
            <Page>
              <Padding>
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
              </Padding>
            </Page>
          </Switch>
        ) : <Login />
      }
      </LayoutManagerWithViewController>
    </BrowserRouter>
  );
}

App.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(App);
