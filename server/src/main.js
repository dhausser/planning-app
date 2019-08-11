import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import passport from 'passport';
import { OAuthStrategy } from 'passport-oauth';
import os from 'os';
import fs from 'fs';

import routes from './routes';
import createStore from './db';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import IssueAPI from './datasources/issue';
import AbsenceAPI from './datasources/absence';
import ResourceAPI from './datasources/resource';

/**
 * Passport
 */
const path = `${os.homedir()}/oauth/jira_privatekey.pem`;
export const consumerSecret = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
export const consumerKey = process.env.CONSUMER_KEY;

passport.use(
  new OAuthStrategy(
    {
      requestTokenURL: 'https://jira.cdprojektred.com/plugins/servlet/oauth/request-token',
      accessTokenURL: 'https://jira.cdprojektred.com/plugins/servlet/oauth/access-token',
      userAuthorizationURL:
        'https://jira.cdprojektred.com/plugins/servlet/oauth/authorize',
      consumerKey: 'RDM',
      consumerSecret,
      callbackURL: '/auth/provider/callback',
      signatureMethod: 'RSA-SHA1',
    },
    ((token, _tokenSecret, _profile, done) => {
      done(null, { token });
    }),
  ),
);
passport.serializeUser(async (user, done) => done(null, user));
passport.deserializeUser((id, done) => done(null, id));

/**
 * Apollo Server
 */
const store = createStore();

const apollo = new ApolloServer({
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
    resourceAPI: new ResourceAPI({ store }),
  }),
});

const app = express();

app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

apollo.applyMiddleware({ app });

const port = process.env.NODE_ENV === 'production' ? 8080 : 4000;

app.listen(port, () => console.log(
  `Server ready at http://localhost:${port}${apollo.graphqlPath}`,
));
