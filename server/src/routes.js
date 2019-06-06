import express from 'express'
import path from 'path'
import fs from 'fs'
import https from 'https'
import { OAuth } from 'oauth'
import { consumerKey, consumerPrivateKeyFile } from '../config'

/**
 * TODO: Callback URL should be set to the app hostname
 * localhost:3000 in dev
 * localhost:4000 in build
 * roadmap.cdprojektred in prod
 */
const callbackURL = 'http://localhost:4000/auth/callback'

const router = express.Router()
const privateKeyData = fs.readFileSync(consumerPrivateKeyFile, 'utf8')
const consumer = new OAuth(
  `https://${process.env.HOST}/plugins/servlet/oauth/request-token`,
  `https://${process.env.HOST}/plugins/servlet/oauth/access-token`,
  consumerKey,
  privateKeyData,
  '1.0',
  callbackURL,
  'RSA-SHA1',
)

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
        response.redirect(
          `${process.env.APP_URL}/?token=${request.session.oauthAccessToken}`,
        )
      }
    },
  )
})

router.get('/issue', () => getRequest())

router.use(express.static(path.join(__dirname, 'build')))

router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

export default router

export function getRequest() {
  const options = {
    hostname: 'jira.cdprojektred.com',
    port: 443,
    path: '/rest/api/latest/issue/GWENT-63428',
    method: 'GET',
    headers: {
      // 'Content-Type': 'application/json',
      // Authorization: 'Basic ZGF2eS5oYXVzc2VyOnJhZG5hLjE0NTc=',
      Authorization: 'Bearer 0YgkTFn43y25OocgdE5IF8JQWx6YdBZq',
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
