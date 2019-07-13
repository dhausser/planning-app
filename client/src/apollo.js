import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { resolvers, typeDefs } from './resolvers';

const uri = `${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_URL : ''}/graphql`;
const httpLink = createHttpLink({
  uri,
  credentials: 'same-origin',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      token,
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

const visibilityFilter = JSON.parse(localStorage.getItem('visibilityFilter'))
  || {
    project: null, version: null, team: null, __typename: 'VisibilityFilter',
  };

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
    visibilityFilter,
    secret: 'Hello, World!',
    versionId: '42',
  },
});

export default client;
