import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import errorhandler from 'errorhandler'
import morgan from 'morgan'
import session from 'express-session'
import path from 'path'

import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './schema'

import IssueAPI from './datasources/issue'
import AbsenceAPI from './datasources/absence'
import ResourceAPI from './datasources/resource'

import './db'

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

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,
  ),
)
