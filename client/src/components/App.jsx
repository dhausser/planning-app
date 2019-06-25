import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Query, ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import {
  LayoutManagerWithViewController,
  NavigationProvider,
  withNavigationViewController,
} from '@atlaskit/navigation-next';
import '@atlaskit/css-reset';
import {
  GlobalNavigation,
  ProductHomeView,
  ProductIssuesView,
  ProjectHomeView,
} from '.';
import {
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
} from '../pages';
import { resolvers, typeDefs } from '../resolvers';
import { IS_LOGGED_IN } from '../queries';

const httpLink = createHttpLink({
  uri: '/graphql',
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
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default () => (
  <Router>
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <Query query={IS_LOGGED_IN}>
          {({ data }) => (data.isLoggedIn
            ? (
              <NavigationProvider>
                <AppWithNavigationViewController client={client} />
              </NavigationProvider>
            )
            : <Login />)
      }
        </Query>
      </ApolloHooksProvider>
    </ApolloProvider>
  </Router>
);
