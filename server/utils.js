const { MongoClient } = require('mongodb');
const passport = require('passport');
const { OAuthStrategy } = require('passport-oauth');
const path = require('path');
const fs = require('fs');
const os = require('os');

const filePath = path.join(os.homedir(), '/.oauth/jira_privatekey.pem');
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

async function createStore() {
  const client = await MongoClient.connect(process.env.DATABASE, {
    poolSize: 50,
    wtimeout: 2500,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });

  try {
    const resources = client.db(process.env.DBNAME).collection('resources');
    return { resources };
  } catch (e) {
    console.error(
      `Unable to establish collection handles in resourceDAO: ${e}`,
    );
    return null;
  }
}

module.exports = {
  consumerSecret,
  consumerKey,
  passport,
  createStore,
};
