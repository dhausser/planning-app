import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';

import passport from './utils';
import routes from './routes';
import typeDefs from './schema';
import resolvers from './resolvers';
import IssueAPI from './datasources/issue';
import AbsenceAPI from './datasources/absence';
import UserAPI from './datasources/resource';
// import ResourcesDAO from './dao/resourcesDAO';

dotenv.config();
const prisma = new PrismaClient();
const MongoStore = connectMongo(session);
const app = express();
const port = process.env.PORT;

// app.use(
//   session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {},
//     store: new MongoStore({ url: process.env.DATABASE as string }),
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
// app.use('/', routes);

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
    userAPI: new UserAPI({ prisma }),
    // resourceAPI: ResourcesDAO,
  }),
});

apolloServer.applyMiddleware({ app });

app.listen(port, () =>
  console.log(
    `💻 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  )
);

// MongoClient.connect(process.env.DATABASE, {
//   poolSize: 50,
//   wtimeout: 2500,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .catch((err) => {
//     console.error(err.stack);
//     process.exit(1);
//   })
//   .then(async (client) => {
//     await ResourcesDAO.injectDB(client);
//     console.log('📦 MongoDB database connection establised');
//     app.listen(port, () => console.log(
//       `💻 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`,
//     ));
//   });
