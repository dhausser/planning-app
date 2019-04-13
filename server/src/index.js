const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createStore } = require('./utils');

const IssueAPI = require('./datasources/issue');
const AbsenceAPI = require('./datasources/absence');
const ResourceAPI = require('./datasources/resource');

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || '';
    const userId = Buffer.from(auth, 'base64').toString('ascii');

    // find a user by their email
    const users = await store.resources.find({ key: userId });
    // const users = await store.resources.findOne({});
    const user = users && users[0] ? users[0] : null;

    // console.log({ auth, userId, user, users });

    return true; // { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI({ store }),
  }),
  // formatError: error => {
  //   console.log(error);
  //   // return new Error('Internal server error');
  //   return error;
  // },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
