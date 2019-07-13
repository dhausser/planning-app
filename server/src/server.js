/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server';

import createStore from './db';

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

import IssueAPI from './datasources/issue';
import AbsenceAPI from './datasources/absence';
import ResourceAPI from './datasources/resource';

const store = createStore();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI({ store }),
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
