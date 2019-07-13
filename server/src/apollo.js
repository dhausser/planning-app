import { ApolloServer } from 'apollo-server-express';
import { consumerKey, consumerSecret } from './passport';

import createStore from './db';

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

import IssueAPI from './datasources/issue';
import AbsenceAPI from './datasources/absence';
import ResourceAPI from './datasources/resource';

const store = createStore();

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error(error);
    return error;
  },
  context: ({ req }) => ({
    token: req.headers.token,
    user: req.user,
  }),
  dataSources: () => ({
    issueAPI: new IssueAPI({ consumerKey, consumerSecret }),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI({ store }),
  }),
});

export default apollo;
