import express from 'express'
import passport from 'passport'
import path from 'path'

const router = express.Router()

/**
 * TODO: Callback URL should be set to the app hostname
 * localhost:3000 in dev
 * localhost:4000 in build
 * roadmap.cdprojektred in prod
 */

// Redirect the user to the OAuth provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
router.get('/auth/provider', passport.authenticate('provider'))

// The OAuth provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
router.get(
  '/auth/provider/callback',
  passport.authenticate('provider', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: 'http://localhost:3000/login',
  }),
)

router.use(express.static(path.join(__dirname, 'build')))
router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

export default router
