import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { NavigationProvider } from '@atlaskit/navigation-next';
import '@atlaskit/css-reset';

import App from './App';
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
 */

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root'),
);
