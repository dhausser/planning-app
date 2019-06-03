import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import errorhandler from 'errorhandler'
import morgan from 'morgan'
import fs from 'fs'
import { OAuth } from 'oauth'
import { consumerKey, consumerPrivateKeyFile } from '../config'

const app = express()

const env = process.env.NODE_ENV || 'development'
if (env === 'development') {
  app.use(errorhandler())
  app.use(cookieParser())
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {},
    }),
  )
  app.use(
    morgan('combined', {
      skip(req, res) {
        return res.statusCode < 400
      },
    }),
  )
}

const privateKeyData = fs.readFileSync(consumerPrivateKeyFile, 'utf8')
const consumer = new OAuth(
  `https://jira.cdprojektred.com/plugins/servlet/oauth/request-token`,
  `https://jira.cdprojektred.com/plugins/servlet/oauth/access-token`,
  consumerKey,
  privateKeyData,
  '1.0',
  'http://localhost:8080/callback',
  'RSA-SHA1',
)

app.get('/', function(request, response) {
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
      response.redirect(
        `https://jira.cdprojektred.com/plugins/servlet/oauth/authorize?oauth_token=${
          request.session.oauthRequestToken
        }`,
      )
    }
  })
})

app.get('/callback', function(request, response) {
  consumer.getOAuthAccessToken(
    request.session.oauthRequestToken,
    request.session.oauthRequestTokenSecret,
    request.query.oauth_verifier,
    function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      console.log({
        request: request.session.oauthRequestToken,
        secret: request.session.oauthRequestTokenSecret,
        verify: request.query.oauth_verifier,
      })
      if (error) {
        console.log(error.data)
        response.send(error)
      } else {
        request.session.oauthAccessToken = oauthAccessToken
        request.session.oauthAccessTokenSecret = oauthAccessTokenSecret

        console.log({
          access: oauthAccessToken,
          secret: oauthAccessTokenSecret,
        })

        consumer.get(
          'https://jira.cdprojektred.com/rest/api/latest/project',
          request.session.oauthAccessToken,
          request.session.oauthAccessTokenSecret,
          function(error, data, resp) {
            console.log(data)
            const result = JSON.parse(data)
            response.send(`I am looking at: ${result.key}`)
          },
        )

        // response.send({ oauthAccessToken, oauthAccessTokenSecret })
      }
    },
  )
})

app.listen(parseInt(process.env.PORT || 8080))
