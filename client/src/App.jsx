import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ApolloProvider as LegacyProvider } from 'react-apollo';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { withNavigationViewController, LayoutManagerWithViewController, NavigationProvider } from '@atlaskit/navigation-next';
import Page from '@atlaskit/page';
import { gridSize } from '@atlaskit/theme';
import '@atlaskit/css-reset';
import styled from 'styled-components';

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

import { IS_LOGGED_IN } from './queries';
import { resolvers, typeDefs } from './resolvers';

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  const tokenSecret = localStorage.getItem('tokenSecret');
  return {
    headers: {
      ...headers,
      authorization: JSON.stringify({ token, tokenSecret }),
    },
  };
});

const cache = new InMemoryCache();
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  resolvers,
  typeDefs,
});

const project = localStorage.getItem('project')
  ? JSON.parse(localStorage.getItem('project'))
  : null;
const version = localStorage.getItem('version')
  ? JSON.parse(localStorage.getItem('version'))
  : null;
const team = localStorage.getItem('team')
  ? JSON.parse(localStorage.getItem('team'))
  : null;

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token') && !!localStorage.getItem('tokenSecret'),
    project,
    version,
    team,
  },
});

const Padding = styled.div`
  margin: ${gridSize() * 4}px ${gridSize() * 8}px;
  padding-bottom: ${gridSize() * 3}px;
`;

function AppRouter({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.addView(ProductHomeView);
    navigationViewController.addView(ProductIssuesView);
    navigationViewController.addView(ProjectHomeView);
  }, [navigationViewController]);
  const { data } = useQuery(IS_LOGGED_IN);
  return (
    <Router>
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
    </Router>
  );
}

const AppWithNavigationViewController = withNavigationViewController(AppRouter);

AppRouter.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

function App() {
  return (
    <ApolloProvider client={client}>
      <LegacyProvider client={client}>
        <NavigationProvider>
          <Page>
            <Padding>
              <AppWithNavigationViewController />
            </Padding>
          </Page>
        </NavigationProvider>
      </LegacyProvider>
    </ApolloProvider>
  );
}

export default App;
