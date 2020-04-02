require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { MongoClient } = require('mongodb');
const { ApolloServer } = require('apollo-server-express');

const { passport } = require('./utils');
const routes = require('./routes');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const IssueAPI = require('./datasources/issue');
const AbsenceAPI = require('./datasources/absence');
// const ResourceAPI = require('./datasources/resource');
const ResourcesDAO = require('./dao/resourcesDAO');

const app = express();
const port = process.env.PORT;

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {},
    store: new MongoStore({ url: process.env.DATABASE }),
  }),
);
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
    resourceAPI: ResourcesDAO,
  }),
});

apolloServer.applyMiddleware({ app });

MongoClient.connect(process.env.DATABASE, {
  poolSize: 50,
  wtimeout: 2500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await ResourcesDAO.injectDB(client);
    console.log('📦 MongoDB database connection establised');
    app.listen(port, () =>
      console.log(
        `💻 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`,
      ),
    );
  });
