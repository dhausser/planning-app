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

export default client;
