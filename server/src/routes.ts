import express, { Router } from 'express';
import { authenticate } from 'passport';
import { join } from 'path';

const router = Router();
const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://roadmap.cdprojektred.com'
  : 'http://localhost:3000';

// Redirect the user to the OAuth provider for authentication.  When
// complete, the provider will redirect the user back to the application at
// /auth/provider/callback
router.get('/auth/provider', authenticate('oauth'));

// The OAuth provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
router.get(
  '/auth/provider/callback',
  authenticate('oauth', {
    successRedirect: `${baseUrl}/login`,
    failureRedirect: `${baseUrl}`,
  }),
);

if (process.env.NODE_ENV === 'production') {
  router.use(express.static(join(__dirname, 'build')));
  router.get('/*', (_req, res) => {
    res.sendFile(join(__dirname, 'build', 'index.html'));
  });
}

export default router;
