const passport = require('passport');
const { OAuthStrategy } = require('passport-oauth');
const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * Passport
 */
const filePath = path.join(os.homedir(), '/oauth/jira_privatekey.pem');
const consumerSecret = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
const consumerKey = 'RDM';

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
    ((token, _tokenSecret, _profile, done) => {
      done(null, { token });
    }),
  ),
);
passport.serializeUser(async (user, done) => done(null, user));
passport.deserializeUser((id, done) => done(null, id));

module.exports = { passport, consumerKey, consumerSecret };
