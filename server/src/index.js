import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import errorhandler from 'errorhandler'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import { OAuth } from 'oauth'

import { ApolloServer } from 'apollo-server-express'
import createStore from './utils'
import resolvers from './resolvers'
import typeDefs from './schema'

import AuthAPI from './datasources/auth'
import IssueAPI from './datasources/issue'
import AbsenceAPI from './datasources/absence'
import ResourceAPI from './datasources/resource'

import { consumerKey, consumerPrivateKeyFile } from '../config'

const app = express()
const port = process.env.NODE_ENV === 'production' ? 8080 : 4000
const store = createStore()

app.use(errorhandler())
app.use(bodyParser())
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

/**
 * AUTHENTICATION *******************************************************************
 */

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

app.get('/auth/connect', function(request, response) {
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

app.get('/auth/callback', function(request, response) {
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
          `http://localhost:3000/?token=${request.session.oauthAccessToken}`,
        )
      }
    },
  )
})

/**
 *************************************************************************************
 */

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.log(error)
    return error
  },
  context: ({ req }) => ({
    auth: req.headers.authorization,
    // user: req.request.user,
  }),
  dataSources: () => ({
    authAPI: new AuthAPI(),
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI({ store }),
  }),
})

apollo.applyMiddleware({ app })

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${apollo.graphqlPath}`,
  ),
)
