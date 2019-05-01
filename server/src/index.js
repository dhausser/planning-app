import express from 'express'
import { ApolloServer } from 'apollo-server-express'

import compression from 'compression'
import cookieParser from 'cookie-parser'
import errorhandler from 'errorhandler'
import morgan from 'morgan'
import session from 'express-session'

import path from 'path'

import './db'

import typeDefs from './schema'
import resolvers from './resolvers'

import IssueAPI from './datasources/issue'
import AbsenceAPI from './datasources/absence'
import ResourceAPI from './datasources/resource'

const app = express()

const port = process.env.PORT
app.set('port', port)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI(),
  }),
})

server.applyMiddleware({ app })

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

app.use(compression())

const staticDir = path.join(__dirname, 'build')
app.use(express.static(staticDir))

app.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
)
