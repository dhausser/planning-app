const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');

const IssueAPI = require('./datasources/issue');
const AbsenceAPI = require('./datasources/absence');
const ResourceAPI = require('./datasources/resource');

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
