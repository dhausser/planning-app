import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import { ApolloServer } from 'apollo-server-express';

import passport from './passport';
import routes from './routes';
import typeDefs from './schema';
import resolvers from './resolvers';
import IssueAPI from './datasources/issue';
import AbsenceAPI from './datasources/absence';
import ResourcesDAO from './dao/resourcesDAO';

export const server = new ApolloServer({
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
    ResourcesDAO
    // resourceAPI: new ResourceAPI({ store }),
  }),
});

const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {},
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

server.applyMiddleware({ app });

export default app;
