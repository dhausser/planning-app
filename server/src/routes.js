import express from 'express'
import path from 'path'
import fs from 'fs'
import https from 'https'
import passport from 'passport'
import OAuth1Strategy from 'passport-oauth1'
import { OAuth } from 'oauth'
import { consumerKey, consumerPrivateKeyFile } from '../config'

/**
 * TODO: Callback URL should be set to the app hostname
 * localhost:3000 in dev
 * localhost:4000 in build
 * roadmap.cdprojektred in prod
 */
// const callbackURL = 'http://localhost:4000/auth/callback'
const callbackURL = '/auth/callback'

const router = express.Router()

const privateKeyData = fs.readFileSync(consumerPrivateKeyFile, 'utf8')

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
      consumerSecret: privateKeyData,
      callbackURL,
      signatureMethod: 'RSA-SHA1',
    },
    function(token, tokenSecret, profile, cb) {
      console.log({ token, tokenSecret, profile })
      return cb(null, profile)
    },
  ),
)

router.get('/auth', passport.authenticate('oauth'))

router.get(
  '/auth/callback',
  passport.authenticate('oauth', { failureRedirect: '/login', session: false }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/')
  },
)

router.get('/login', function(request, response) {
  response.send('Login page')
})

// const consumer = new OAuth(
//   `https://${process.env.HOST}/plugins/servlet/oauth/request-token`,
//   `https://${process.env.HOST}/plugins/servlet/oauth/access-token`,
//   consumerKey,
//   privateKeyData,
//   '1.0',
//   callbackURL,
//   'RSA-SHA1',
// )

router.get('/auth/connect', function(request, response) {
  consumer.getOAuthRequestToken(function(
    error,
    oauthToken,
    oauthTokenSecret,
    results,
  ) {
    if (error) {
      console.log(error.data)
      response.send(error.data)
    } else {
      request.session.oauthRequestToken = oauthToken
      request.session.oauthRequestTokenSecret = oauthTokenSecret
      response.json({ oauthToken })
    }
  })
})

router.get('/auth/callback', function(request, response) {
  console.log('Within callback...')

  consumer.getOAuthAccessToken(
    request.session.oauthRequestToken,
    request.session.oauthRequestTokenSecret,
    request.query.oauth_verifier,
    function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if (error) {
        console.log(error.data)
        response.send(error)
      } else {
        request.session.oauthAccessToken = oauthAccessToken
        request.session.oauthAccessTokenSecret = oauthAccessTokenSecret

        console.log('Trying to fetch some issue')
        consumer.get(
          'https://jira.cdprojektred.com/rest/api/latest/issue/GWENT-63428',
          request.session.oauthAccessToken,
          request.session.oauthAccessTokenSecret,
          function(e, data, res) {
            if (e) console.error(e)
            console.log({ statusCode: e.statusCode, data: e.data })
            console.log('Fetching...')
            console.log({ data })
            console.log('Done Fetching...')
          },
        )
        console.log('Finished Fetching')

        // response.redirect(
        //   `${process.env.APP_URL}/?token=${request.session.oauthAccessToken}`,
        // )
      }
    },
  )
})

router.get('/issue', () => getRequest())

router.get('/test', function(request, response) {
  console.log({
    token: request.session.oauthAccessToken,
    secret: request.session.oauthAccessTokenSecret,
  })
  consumer.get(
    'https://jira.cdprojektred.com/rest/api/latest/issue/GWENT-63428',
    request.session.oauthAccessToken,
    request.session.oauthAccessTokenSecret,
    function(e, data, res) {
      if (e) console.error(e)
      console.log(data)
    },
  )
})

router.use(express.static(path.join(__dirname, 'build')))

router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

export default router

function getRequest() {
  const token = '0YgkTFn43y25OocgdE5IF8JQWx6YdBZq'
  const signature = ''
  const timestamp = ''
  const nonce = ''
  const auth = `OAuth realm="https://jira.cdprojektred.com/",oauth_consumer_key=${consumerKey},oauth_token=${token},oauth_signature_method="RSA-SHA1",oauth_signature=${signature},oauth_timestamp=${timestamp},oauth_nonce=${nonce},oauth_version="1.0"`
  const options = {
    hostname: 'jira.cdprojektred.com',
    port: 443,
    path: '/rest/api/latest/issue/GWENT-63428',
    method: 'GET',
    headers: {
      Authorization: auth,
      // 'Content-Type': 'application/json',
      // Authorization: 'Basic ZGF2eS5oYXVzc2VyOnJhZG5hLjE0NTc=',
      // Authorization: 'Bearer 0YgkTFn43y25OocgdE5IF8JQWx6YdBZq',
    },
  }

  console.log({ options })

  const req = https.request(options, res => {
    console.log('statusCode:', res.statusCode)
    console.log('headers:', res.headers)

    res.on('data', d => {
      process.stdout.write(d)
    })
  })

  req.on('error', e => {
    console.error(e)
  })
  req.end()
}
