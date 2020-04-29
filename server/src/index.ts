require("dotenv").config();
import express from 'express';
import session from 'express-session';
import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';

import passport from './utils';
import routes from './routes';
import typeDefs from './schema';
import resolvers from './resolvers';
import UserAPI from './datasources/user';
import IssueAPI from './datasources/issue';
import AbsenceAPI from './datasources/absence';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT;


/** TODO: configure session store */
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
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
    issueAPI: new IssueAPI({ prisma }),
    absenceAPI: new AbsenceAPI(),
    userAPI: new UserAPI({ prisma })
  }),
});

apolloServer.applyMiddleware({ app });

app.listen(port, () => console.log(
  `💻 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`,
));
