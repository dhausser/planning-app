// / <reference path="node.d.ts"/>
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: `https://auth.atlassian.com/authorize?audience=api.atlassian.com&response_type=code&prompt=consent`,
      tokenURL: process.env.TOKEN_URL,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log({ accessToken, refreshToken, profile, cb });
    }
  )
);

// Oauth 1
// const filePath = join(os.homedir(), process.env.PRIVATE_KEY_PATH as string);
// const consumerSecret = fs.existsSync(filePath)
//   ? fs.readFileSync(filePath, 'utf8')
//   : '';

// const consumerKey = process.env.CONSUMER_KEY;
// const requestTokenURL = process.env.REQUEST_TOKEN_URL;
// const accessTokenURL = process.env.ACCESS_TOKEN_URL;
// const userAuthorizationURL = process.env.USER_AUTHORIZATION_URL;

// passport.use(
//   new OAuthStrategy(
//     {
//       requestTokenURL,
//       accessTokenURL,
//       userAuthorizationURL,
//       consumerKey,
//       consumerSecret,
//       callbackURL: '/auth/provider/callback',
//       signatureMethod: 'RSA-SHA1',
//     },
//     (
//       token: string,
//       _tokenSecret: string,
//       _profile: object,
//       done: (arg0: null, arg1: { token: string }) => void
//     ) => {
//       done(null, { token });
//     }
//   )
// );
passport.serializeUser(async (user, done) => done(null, user));
passport.deserializeUser((id, done) => done(null, id));

const consumerKey = '';
const consumerSecret = '';

export default passport;
export { consumerSecret, consumerKey };
