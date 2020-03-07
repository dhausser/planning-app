import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
} from '@apollo/client';

import { resolvers, typeDefs } from './resolvers';
import projectId from './config';

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

function writeInitialData() {
  cache.writeQuery({
    query: gql`
      query {
        isLoggedIn @client
        projectId @client
        versionId @client
        statusId @client
        teamId @client
        networkStatus @client {
          isConnected
        }
      }
    `,
    data: {
      isLoggedIn: !!localStorage.getItem('token'),
      projectId: localStorage.getItem('projectId') || projectId,
      versionId: localStorage.getItem('versionId') || null,
      statusId: localStorage.getItem('statusId') || null,
      teamId: localStorage.getItem('teamId') || null,
      networkStatus: {
        __typename: 'NetworkStatus',
        isConnected: false,
      },
    },
  });
}

writeInitialData();

client.onResetStore(writeInitialData);

export default client;
