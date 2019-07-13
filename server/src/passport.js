import passport from 'passport';
import { OAuthStrategy } from 'passport-oauth';
import os from 'os';
import fs from 'fs';

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

export default passport;
