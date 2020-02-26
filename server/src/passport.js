import passport from "passport"
import { OAuthStrategy } from "passport-oauth"
import path from "path"
import fs from "fs"
import os from "os"

/**
 * Passport
 */
const filePath = path.join(os.homedir(), "/oauth/jira_privatekey.pem")
export const consumerSecret = fs.existsSync(filePath)
  ? fs.readFileSync(filePath, "utf8")
  : ""
export const consumerKey = "RDM"
const requestTokenURL =
  "https://jira.cdprojektred.com/plugins/servlet/oauth/request-token"
const accessTokenURL =
  "https://jira.cdprojektred.com/plugins/servlet/oauth/access-token"
const userAuthorizationURL =
  "https://jira.cdprojektred.com/plugins/servlet/oauth/authorize"

passport.use(
  new OAuthStrategy(
    {
      requestTokenURL,
      accessTokenURL,
      userAuthorizationURL,
      consumerKey,
      consumerSecret,
      callbackURL: "/auth/provider/callback",
      signatureMethod: "RSA-SHA1",
    },
    (token, _tokenSecret, _profile, done) => done(null, { token })
  )
)
passport.serializeUser(async (user, done) => done(null, user))
passport.deserializeUser((id, done) => done(null, id))

export default passport
