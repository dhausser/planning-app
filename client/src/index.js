import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';


import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { NavigationProvider } from '@atlaskit/navigation-next';
import '@atlaskit/css-reset';

import Pages from './pages';
import Login from './pages/Login';
import { resolvers, typeDefs } from './resolvers';

// Set up our apollo-client to point at the server we created
// this can be local or a remote endpoint
const cache = new InMemoryCache();
const client = new ApolloClient({
  link: new HttpLink({
    uri: '/graphql',
    headers: {
      authorization: localStorage.getItem('token'),
    },
  }),
  cache,
  resolvers,
  typeDefs,
});

const filter = JSON.parse(localStorage.getItem('filter'))
|| {
  project: {
    id: null,
    name: null,
    __typename: 'Project',
  },
  version: {
    id: null,
    name: null,
    __typename: 'Version',
  },
  team: {
    id: null,
    name: null,
    __typename: 'Team',
  },
  __typename: 'Filter',
};

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
    filter,
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

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <NavigationProvider>
      <BrowserRouter>
        <IsLoggedIn />
      </BrowserRouter>
    </NavigationProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
