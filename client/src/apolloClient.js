import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import { resolvers, typeDefs } from './resolvers';

// TODO: Handle default project selection
const DEFAULT_PROJECT_ID = 10500;

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
      projectId: localStorage.getItem('projectId') || DEFAULT_PROJECT_ID,
      versionId: localStorage.getItem('versionId'),
      statusId: localStorage.getItem('statusId'),
      teamId: localStorage.getItem('teamId'),
    },
  });
}

writeInitialData();

client.onResetStore(writeInitialData);

export default client;
