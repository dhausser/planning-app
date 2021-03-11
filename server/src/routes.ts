import express, { Router } from 'express';
import { authenticate } from 'passport';
import { join } from 'path';

const router = Router();

// Redirect the user to the OAuth provider for authentication.  When
// complete, the provider will redirect the user back to the application at
// /auth/provider/callback
// router.get('/auth/provider', authenticate('oauth2'));
router.get('/auth/provider', (req, res) =>
  res.redirect(process.env.AUTHORIZATION_URL)
);

// The OAuth provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
router.get(
  '/auth/provider/callback',
  authenticate('oauth2', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    successRedirect: `${process.env.FRONTEND_URL}`,
  })
  // (req, res) => {
  //   console.log(process.env.FRONTEND_URL);
  //   // Successful authentication, redirect home.
  //   res.redirect(`${process.env.FRONTEND_URL}`);
  // }
);
// router.get('/auth/provider/callback', (req, res) => {
//   const { code } = req.query;
//   console.log(code);
//   // Successful authentication, redirect home.
//   // res.redirect(`${process.env.FRONTEND_URL}`);
// });

// curl --request POST \
//   --url 'https://auth.atlassian.com/oauth/token' \
//   --header 'Content-Type: application/json' \
//   --data '{"grant_type": "authorization_code","client_id": "YOUR_CLIENT_ID","client_secret": "YOUR_CLIENT_SECRET","code": "YOUR_AUTHORIZATION_CODE","redirect_uri": "https://YOUR_APP_CALLBACK_URL"}'

if (process.env.NODE_ENV === 'production') {
  router.use(express.static(join(__dirname, 'build')));
  router.get('/*', (_req, res) => {
    res.sendFile(join(__dirname, 'build', 'index.html'));
  });
}

export default router;
