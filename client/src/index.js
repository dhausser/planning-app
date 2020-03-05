import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  useQuery,
  gql,
} from '@apollo/client';
import {
  NavigationProvider,
  withNavigationViewController,
  LayoutManagerWithViewController,
} from '@atlaskit/navigation-next';

import Pages from './pages';
import Login from './pages/Login';
import { resolvers, typeDefs } from './resolvers';
import '@atlaskit/css-reset';

import GlobalNavigation from './components/Nav/GlobalNavigation';
import productHomeView from './components/Nav/ProductHomeView';
import productIssuesView from './components/Nav/ProductIssuesView';
import projectHomeView from './components/Nav/ProjectHomeView';
import { defaultProjectId } from './config';

// Set up our apollo-client to point at the server we created
// this can be local or a remote endpoint
const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: '/graphql',
    credentials: 'include',
    headers: {
      authorization: localStorage.getItem('token'),
    },
  }),
  resolvers,
  typeDefs,
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
    projectId: localStorage.getItem('projectId') || defaultProjectId,
    versionId: localStorage.getItem('versionId'),
    statusId: localStorage.getItem('statusId'),
    teamId: localStorage.getItem('teamId'),
  },
});

/**
 * Render our app
 * - We wrap the whole app with ApolloProvider, so any component in the app can
 *    make GraphqL requests. Our provider needs the client we created above,
 *    so we pass it as a prop
 * - We need a router, so we can navigate the app. We're using Reach router for this.
 *    The router chooses between which component to render, depending on the url path.
 *    ex: localhost:3000/login will render only the `Login` component
 */

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function IsLoggedIn({ navigationViewController }) {
  const { data } = useQuery(IS_LOGGED_IN);
  useEffect(() => {
    navigationViewController.addView(productHomeView);
    navigationViewController.addView(productIssuesView);
    navigationViewController.addView(projectHomeView);
  }, [navigationViewController]);
  return (
    <LayoutManagerWithViewController
      globalNavigation={GlobalNavigation}
    >
      {data.isLoggedIn ? <Pages /> : <Login />}
    </LayoutManagerWithViewController>
  );
}

IsLoggedIn.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

const NavigationViewController = withNavigationViewController(IsLoggedIn);

ReactDOM.render(

  <ApolloProvider client={client}>
    <NavigationProvider>
      <NavigationViewController />
    </NavigationProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
