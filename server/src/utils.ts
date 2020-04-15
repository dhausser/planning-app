/// <reference path="node.d.ts"/>
import passport from 'passport';
import { OAuthStrategy } from 'passport-oauth';
import path from 'path';
import fs from 'fs';
import os from 'os';

const filePath = path.join(os.homedir(), process.env.PRIVATE_KEY_PATH!);
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
    (
      token: string,
      _tokenSecret: string,
      _profile: object,
      done: (arg0: null, arg1: { token: string }) => void,
    ) => {
      done(null, { token });
    },
  ),
);
passport.serializeUser(async (user, done) => done(null, user));
passport.deserializeUser((id, done) => done(null, id));

export default passport;
export { consumerSecret, consumerKey };
