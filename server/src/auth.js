import fs from 'fs';
import passport from 'passport';
import { OAuthStrategy } from 'passport-oauth';
import { consumerKey, consumerPrivateKeyFile } from '../config';

const consumerSecret = fs.readFileSync(consumerPrivateKeyFile, 'utf8');

passport.use(
  new OAuthStrategy(
    {
      requestTokenURL: 'https://jira.cdprojektred.com/plugins/servlet/oauth/request-token',
      accessTokenURL: 'https://jira.cdprojektred.com/plugins/servlet/oauth/access-token',
      userAuthorizationURL:
        'https://jira.cdprojektred.com/plugins/servlet/oauth/authorize',
      consumerKey,
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

export default consumerSecret;
