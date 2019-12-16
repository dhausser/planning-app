import React from 'react';
import ReactDOM from 'react-dom';

import {
  ApolloClient, InMemoryCache, HttpLink, ApolloProvider,
} from '@apollo/client';

import { NavigationProvider } from '@atlaskit/navigation-next';
import '@atlaskit/css-reset';

import Pages from './pages';
import { resolvers, typeDefs } from './resolvers';

// Set up our apollo-client to point at the server we created
// this can be local or a remote endpoint
const cache = new InMemoryCache();
const client = new ApolloClient({
  link: new HttpLink({
    uri: '/graphql',
    credentials: 'same-origin',
    headers: {
      authorization: localStorage.getItem('token'),
    },
  }),
  cache,
  resolvers,
  typeDefs,
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
    projectId: localStorage.getItem('projectId'),
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

ReactDOM.render(
  <ApolloProvider client={client}>
    <NavigationProvider>
      <Pages />
    </NavigationProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
