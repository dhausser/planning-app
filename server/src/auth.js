import fs from 'fs'
import passport from 'passport'
import OAuth1Strategy from 'passport-oauth1'
import { consumerKey, consumerPrivateKeyFile } from '../config'

passport.use(
  new OAuth1Strategy(
    {
      requestTokenURL: `https://${
        process.env.HOST
      }/plugins/servlet/oauth/request-token`,
      accessTokenURL: `https://${
        process.env.HOST
      }/plugins/servlet/oauth/access-token`,
      userAuthorizationURL:
        'https://jira.cdprojektred.com/plugins/servlet/oauth/authorize',
      consumerKey,
      consumerSecret: fs.readFileSync(consumerPrivateKeyFile, 'utf8'),
      callbackURL: '/login/callback',
      signatureMethod: 'RSA-SHA1',
    },
    function(token, tokenSecret, profile, cb) {
      console.log({ token, tokenSecret, profile })

      return cb(null, profile)
    },
  ),
)

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  // TODO: Get user from Jira
  console.log('Serializing user...')
  console.log({ id })
  const err = null
  const user = { key: 'davy.hausser', name: 'Davy Hausser' }
  return done(err, user)
})
