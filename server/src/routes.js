import express from 'express'
import path from 'path'
import fs from 'fs'
import { OAuth } from 'oauth'
import { consumerKey, consumerPrivateKeyFile } from '../config'

const router = express.Router()
const privateKeyData = fs.readFileSync(consumerPrivateKeyFile, 'utf8')
const consumer = new OAuth(
  `https://jira.cdprojektred.com/plugins/servlet/oauth/request-token`,
  `https://jira.cdprojektred.com/plugins/servlet/oauth/access-token`,
  consumerKey,
  privateKeyData,
  '1.0',
  'http://localhost:4000/auth/callback',
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

        // Test fetching data
        // getData(request, response)

        response.redirect(
          `${process.env.APP_URL}/?token=${request.session.oauthAccessToken}`,
        )
      }
    },
  )
})

router.use(express.static(path.join(__dirname, 'build')))

router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

export default router

function getData(request, response) {
  const url = 'https://jira.cdprojektred.com/rest/api/latest/project'
  consumer.get(
    url,
    request.session.oauthAccessToken,
    request.session.oauthAccessTokenSecret,
    function(error, data, resp) {
      if (error) {
        console.error(error)
      }
      console.log(data)
      const result = JSON.parse(data)
      response.send(`I am looking at: ${result.key}`)
    },
  )
}
