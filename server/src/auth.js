import fs from 'fs'
import passport from 'passport'
import { OAuthStrategy } from 'passport-oauth'
import { consumerKey, consumerPrivateKeyFile } from '../config'

passport.use(
  'provider',
  new OAuthStrategy(
    {
      requestTokenURL: `https://jira.cdprojektred.com/plugins/servlet/oauth/request-token`,
      accessTokenURL: `https://jira.cdprojektred.com/plugins/servlet/oauth/access-token`,
      userAuthorizationURL:
        'https://jira.cdprojektred.com/plugins/servlet/oauth/authorize',
      consumerKey,
      consumerSecret: fs.readFileSync(consumerPrivateKeyFile, 'utf8'),
      callbackURL: '/auth/provider/callback',
      signatureMethod: 'RSA-SHA1',
    },
    function(token, tokenSecret, profile, cb) {
      console.log({ token, tokenSecret, profile })
      return cb(null, profile)
    },
  ),
)

passport.serializeUser(function(user, done) {
  // TODO: Get user from Jira
  // console.log('Serializing user...')
  // console.log({ id })
  // const err = null
  // const user = { key: 'davy.hausser', name: 'Davy Hausser' }
  return done(null, user)
})

passport.deserializeUser(function(id, done) {
  // TODO: Get user from Jira
  console.log('Serializing user...')
  console.log({ id })
  const err = null
  const user = { key: 'davy.hausser', name: 'Davy Hausser' }
  return done(err, user)
})
