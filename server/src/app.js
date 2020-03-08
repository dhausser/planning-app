import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import { ApolloServer } from 'apollo-server-express';

// import databaseConnectionPromise from './db';
import passport from './passport';
import routes from './routes';
import typeDefs from './schema';
import resolvers from './resolvers';
import IssueAPI from './datasources/issue';
import AbsenceAPI from './datasources/absence';
import ResourcesDAO from './dao/resourcesDAO';

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

  // await (async () => databaseConnectionPromise)();

  app.listen(port, () => console.log(
    `Server ready at http://localhost:${port}${apolloServer.graphqlPath}`,
  ));
})();
