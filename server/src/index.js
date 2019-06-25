import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { OAuthStrategy } from 'passport-oauth';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import errorhandler from 'errorhandler';
import bodyParser from 'body-parser';
import os from 'os';
import fs from 'fs';
import routes from './routes';
import createStore from './db';
import resolvers from './resolvers';
import typeDefs from './schema';
import IssueAPI from './datasources/issue';
import AbsenceAPI from './datasources/absence';
import ResourceAPI from './datasources/resource';

// SSL Parameters
const consumerKey = 'RDM';
const consumerPrivateKeyFile = `${os.homedir()}\\oauth\\jira_privatekey.pem`;
const consumerSecret = fs.readFileSync(consumerPrivateKeyFile, 'utf8');

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
    ((token, tokenSecret, _profile, done) => {
      done(null, { token, tokenSecret });
    }),
  ),
);
passport.serializeUser(async (user, done) => done(null, user));
passport.deserializeUser((id, done) => done(null, id));

const app = express();
const port = process.env.PORT;
const store = createStore();

app.use(errorhandler());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {},
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error(error);
    return error;
  },
  context: ({ req }) => ({
    auth: req.headers.authorization,
    user: req.user,
  }),
  dataSources: () => ({
    issueAPI: new IssueAPI({ consumerKey, consumerSecret }),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI({ store }),
  }),
});

apollo.applyMiddleware({ app });

// eslint-disable-next-line no-console
app.listen(port, () => console.log(
  `🚀 Server ready at http://localhost:${port}${apollo.graphqlPath}`,
));
