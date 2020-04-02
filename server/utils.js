const passport = require('passport');
const { OAuthStrategy } = require('passport-oauth');
const path = require('path');
const fs = require('fs');
const os = require('os');

const filePath = path.join(os.homedir(), process.env.PRIVATE_KEY_PATH);
const consumerSecret = fs.existsSync(filePath)
  ? fs.readFileSync(filePath, 'utf8')
  : '';

const consumerKey = process.env.CONSUMER_KEY;
const requestTokenURL = process.env.REQUEST_TOKEN_URL;
const accessTokenURL = process.env.ACCESS_TOKEN_URL;
const userAuthorizationURL = process.env.USER_AUTHORIZATION_URL;

passport.use(
  new OAuthStrategy(
    {
      requestTokenURL,
      accessTokenURL,
      userAuthorizationURL,
      consumerKey,
      consumerSecret,
      callbackURL: '/auth/provider/callback',
      signatureMethod: 'RSA-SHA1',
    },
    (token, _tokenSecret, _profile, done) => {
      done(null, { token });
    },
  ),
);
passport.serializeUser(async (user, done) => done(null, user));
passport.deserializeUser((id, done) => done(null, id));

module.exports = {
  consumerSecret,
  consumerKey,
  passport,
};
