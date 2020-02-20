import passport from 'passport';
import { OAuthStrategy } from 'passport-oauth';
import path from 'path';
import fs from 'fs';
import os from 'os';

/**
 * Passport
 */
const filepath = path.join(os.homedir(), process.env.PRIVATE_KEY_PATH);
export const consumerSecret = fs.existsSync(filepath) ? fs.readFileSync(filepath, 'utf8') : '';
export const consumerKey = process.env.CONSUMER_KEY;

passport.use(
  new OAuthStrategy(
    {
      requestTokenURL: process.env.REQUEST_TOKEN_URL,
      accessTokenURL: process.env.ACCESS_TOKEN_URL,
      userAuthorizationURL: process.env.USER_AUTHORIZATION_URL,
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

export default passport;
