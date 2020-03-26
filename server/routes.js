const express = require('express');
const passport = require('passport');
const path = require('path');

const router = express.Router();
const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://roadmap.cdprojektred.com'
  : 'http://localhost:3000';

// Redirect the user to the OAuth provider for authentication.  When
// complete, the provider will redirect the user back to the application at
// /auth/provider/callback
router.get('/auth/provider', passport.authenticate('oauth'));

// The OAuth provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
router.get(
  '/auth/provider/callback',
  passport.authenticate('oauth', {
    successRedirect: `${baseUrl}/login`,
    failureRedirect: `${baseUrl}`,
  }),
);

router.use(express.static(path.join(__dirname, 'build')));
router.get('/*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = router;