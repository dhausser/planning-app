import express from 'express'
import errorhandler from 'errorhandler'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'
import fs from 'fs'
import { OAuth } from 'oauth'
import { consumerPrivateKeyFile, consumerKey } from './config'

const app = express()

const env = process.env.NODE_ENV || 'development'
if (env === 'development') {
  app.use(errorhandler())
  app.use(
    morgan('combined', {
      skip(req, res) {
        return res.statusCode < 400
      },
    }),
  )
  app.use(cookieParser())
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    }),
  )
}

const privateKeyData = fs.readFileSync(consumerPrivateKeyFile, 'utf8')

const consumer = new OAuth(
  `https://${process.env.HOST}/plugins/servlet/oauth/request-token`,
  `https://${process.env.HOST}/plugins/servlet/oauth/access-token`,
  consumerKey,
  '',
  '1.0',
  'http://localhost:8080/sessions/callback',
  'RSA-SHA1',
  null,
  privateKeyData,
)

app.get('/', function(request, response) {
  response.send('Hello World')
})

app.get('/sessions/connect', function(request, response) {
  consumer.getOAuthRequestToken(function(
    error,
    oauthToken,
    oauthTokenSecret,
    results,
  ) {
    if (error) {
      console.log(error.data)
      response.send('Error getting OAuth access token')
    } else {
      request.session.oauthRequestToken = oauthToken
      request.session.oauthRequestTokenSecret = oauthTokenSecret
      response.redirect(
        `https://${
          process.env.HOST
        }/plugins/servlet/oauth/authorize?oauth_token=${
          request.session.oauthRequestToken
        }`,
      )
    }
  })
})

app.get('/sessions/callback', function(request, response) {
  consumer.getOAuthAccessToken(
    request.session.oauthRequestToken,
    request.session.oauthRequestTokenSecret,
    request.query.oauth_verifier,
    function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if (error) {
        console.log(error.data)
        response.send('error getting access token')
      } else {
        request.session.oauthAccessToken = oauthAccessToken
        request.session.oauthAccessTokenSecret = oauthAccessTokenSecret
        consumer.get(
          `https://${process.env.HOST}/rest/api/latest/issue/JRADEV-8110.json`,
          request.session.oauthAccessToken,
          request.session.oauthAccessTokenSecret,
          'application/json',
          function(error, data, resp) {
            console.log(data)
            const parsedData = JSON.parse(data)
            response.send(`I am looking at: ${parsedData.key}`)
          },
        )
      }
    },
  )
})

app.listen(parseInt(process.env.PORT || 8080))
