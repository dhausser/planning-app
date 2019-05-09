import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import path from 'path'
import fs from 'fs'
import https from 'https'
import http from 'http'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import errorhandler from 'errorhandler'
import morgan from 'morgan'
import session from 'express-session'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/schema'

import IssueAPI from './datasources/issue'
import AbsenceAPI from './datasources/absence'
import ResourceAPI from './datasources/resource'

import './db'

const configurations = {
  // Note: You may need sudo to run on port 443
  // production: { ssl: true, port: 443, hostname: 'example.com' },
  production: { ssl: false, port: 8080, hostname: 'localhost' },
  development: { ssl: false, port: 4000, hostname: 'localhost' },
}

const environment = process.env.NODE_ENV || 'production'
const config = configurations[environment]

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI(),
  }),
})

const app = express()
apollo.applyMiddleware({ app })

if (environment === 'development') {
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

app.use(compression())

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// Create the HTTPS or HTTP server, per configuration
let server
if (config.ssl) {
  // Assumes certificates are in .ssl folder from package root. Make sure the files
  // are secured.
  server = https.createServer(
    {
      key: fs.readFileSync(`../ssl/${environment}/server.key`),
      cert: fs.readFileSync(`../ssl/${environment}/server.crt`),
    },
    app,
  )
} else {
  server = http.createServer(app)
}

server.listen({ port: config.port }, () =>
  console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${
      apollo.graphqlPath
    }`,
  ),
)
