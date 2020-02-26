import express from "express"
import passport from "passport"
import path from "path"

const router = express.Router()
const baseUrl = `http://localhost:80${
  process.env.NODE_ENV === "production" ? "80" : "00"
}`

// Redirect the user to the OAuth provider for authentication.  When
// complete, the provider will redirect the user back to the application at
// /auth/provider/callback
router.get("/auth/provider", passport.authenticate("oauth"))

// The OAuth provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
router.get(
  "/auth/provider/callback",
  passport.authenticate("oauth", {
    successRedirect: `${baseUrl}/login-mutation`,
    failureRedirect: `${baseUrl}/login`,
  })
)

router.get("/graphql", (req, res, next) => {
  console.log({
    url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    user: req.user,
    sessionID: req.sessionID,
    session: req.session,
    cookie: JSON.stringify(req.cookie),
  })

  return next()
})

if (process.env.NODE_ENV === "production") {
  const clientPath = "../../client/public"
  router.use(express.static(path.join(__dirname, clientPath)))
  router.get("/*", (_req, res) => {
    res.sendFile(path.join(__dirname, clientPath, "index.html"))
  })
}

export default router
