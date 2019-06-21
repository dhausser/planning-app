import fs from 'fs'
import btoa from 'btoa'
import crypto2 from 'crypto2'
import passport from 'passport'
import { OAuthStrategy } from 'passport-oauth'
import {
  consumerKey,
  consumerPrivateKeyFile,
  consumerPublicKeyFile,
} from '../config'

const consumerSecret = fs.readFileSync(consumerPrivateKeyFile, 'utf8')
// const consumerPublicKey = fs.readFileSync(consumerPublicKeyFile, 'utf8')

passport.use(
  'jira',
  new OAuthStrategy(
    {
      requestTokenURL: `https://jira.cdprojektred.com/plugins/servlet/oauth/request-token`,
      accessTokenURL: `https://jira.cdprojektred.com/plugins/servlet/oauth/access-token`,
      userAuthorizationURL:
        'https://jira.cdprojektred.com/plugins/servlet/oauth/authorize',
      consumerKey,
      consumerSecret,
      callbackURL: '/auth/provider/callback',
      signatureMethod: 'RSA-SHA1',
    },
    function(token, tokenSecret, profile, done) {
      console.log({ token, tokenSecret, profile })
      done(null, token)
    },
  ),
)

// Authorization: OAuth
// oauth_consumer_key="9djdj82h48djs9d2",
// oauth_token="kkk9d7dh3k39sjv7",
// oauth_signature_method="RSA-SHA1",
// oauth_timestamp="137131201",
// oauth_nonce="7d8f3e4a",
// oauth_signature="bYT5CMsGcbgUdFHObYMEfcx6bsw%3D"

passport.serializeUser(async function(user, done) {
  // TODO: Get user from Jira
  console.log('Serializing...')

  const nonce =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  const timestamp = 1561150655 // Date.now()

  const baseString = `oauth_consumer_key="${consumerKey}", oauth_token="${user}", oauth_signature_method="RSA-SHA1", oauth_timestamp="${timestamp}", oauth_nonce="${nonce}, oauth_version="1.0"`

  // const hash = await crypto2.sign.sha1(baseString, consumerSecret)
  const hash = await crypto2.hash.sha1(baseString)
  const signature = encodeURIComponent(btoa(hash))

  const auth = `oauth_consumer_key="${consumerKey}", oauth_token="${user}", oauth_signature_method="RSA-SHA1", oauth_signature="${signature}", oauth_timestamp="${timestamp}", oauth_nonce="${nonce}", oauth_version="1.0"`
  console.log({ auth })

  return done(null, auth)
})

passport.deserializeUser(function(id, done) {
  console.log('Deserializing...')
  return done(null, id)
})
