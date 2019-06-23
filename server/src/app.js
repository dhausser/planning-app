import express from 'express';
import { OAuth } from 'oauth';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import errorhandler from 'errorhandler';
import bodyParser from 'body-parser';
import fs from 'fs';
import { consumerKey, consumerPrivateKeyFile } from '../config';

const app = express();

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

const consumerSecret = fs.readFileSync(consumerPrivateKeyFile, 'utf8');

const consumer = new OAuth(
  'https://jira.cdprojektred.com/plugins/servlet/oauth/request-token',
  'https://jira.cdprojektred.com/plugins/servlet/oauth/access-token',
  consumerKey,
  consumerSecret,
  '1.0',
  `http://localhost:${process.env.PORT}/sessions/callback`,
  'RSA-SHA1',
);

app.get('/', (_request, response) => {
  response.send('Hello World');
});

app.get('/sessions/connect', (request, response) => {
  consumer.getOAuthRequestToken((
    error,
    oauthToken,
    oauthTokenSecret,
  ) => {
    if (error) {
      response.send('Error getting OAuth access token');
    } else {
      request.session.oauthRequestToken = oauthToken;
      request.session.oauthRequestTokenSecret = oauthTokenSecret;
      response.redirect(
        `https://jira.cdprojektred.com/plugins/servlet/oauth/authorize?oauth_token=${
          request.session.oauthRequestToken
        }`,
      );
    }
  });
});

app.get('/sessions/callback', (request, response) => {
  consumer.getOAuthAccessToken(
    request.session.oauthRequestToken,
    request.session.oauthRequestTokenSecret,
    request.query.oauth_verifier,
    (error, oauthAccessToken, oauthAccessTokenSecret) => {
      if (error) {
        response.send('error getting access token');
      } else {
        request.session.oauthAccessToken = oauthAccessToken;
        request.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
        consumer.get(
          'https://jira.cdprojektred.com/rest/api/2/issue/GWENT-66666.json',
          request.session.oauthAccessToken,
          request.session.oauthAccessTokenSecret,
          (_error, data) => {
            response.send(`I am looking at: ${data}`);
          },
        );
      }
    },
  );
});

app.listen(parseInt(process.env.PORT || 8080, 10));
