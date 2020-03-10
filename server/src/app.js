require('dotenv/config');
const express = require('express');
const session = require('express-session');
const { ApolloServer } = require('apollo-server-express');

const databaseConnectionPromise = require('./db');
const { passport } = require('./passport');
const routes = require('./routes');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const IssueAPI = require('./datasources/issue');
const AbsenceAPI = require('./datasources/absence');
const ResourcesDAO = require('./dao/resourcesDAO');

(async () => {
  const app = express();
  const port = process.env.PORT || process.env.NODE_ENV === 'production' ? 8080 : 4000;

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {},
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/', routes);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error(error);
      return error;
    },
    context: ({ req }) => ({
      authorization: req.headers.authorization,
      user: req.user,
    }),
    dataSources: () => ({
      issueAPI: new IssueAPI(),
      absenceAPI: new AbsenceAPI(),
      // resourceAPI: new ResourceAPI({ store }),
      ResourcesDAO,
    }),
  });

  apolloServer.applyMiddleware({ app });

  await (async () => databaseConnectionPromise)();

  app.listen(port, () => console.log(
    `Server ready at http://localhost:${port}${apolloServer.graphqlPath}`,
  ));
})();
