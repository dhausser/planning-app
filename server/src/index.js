import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import path from 'path'
import http from 'http'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import errorhandler from 'errorhandler'
import session from 'express-session'
import resolvers from './resolvers'
import typeDefs from './schema'

import IssueAPI from './datasources/issue'
import AbsenceAPI from './datasources/absence'
import ResourceAPI from './datasources/resource'

import './db'

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || ''
    const user = () => ({ id: 'davy.hausser', name: 'Davy Hausser' })
    return { user, token }
  },
  dataSources: () => ({
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI(),
  }),
})

const app = express()
apollo.applyMiddleware({ app })

app.use(errorhandler())
app.use(cookieParser())
app.use(compression())
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
)

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const port = process.env.NODE_ENV === 'production' ? 8080 : 4000

http
  .createServer(app)
  .listen({ port }, () =>
    console.log(
      '🚀 Server ready at',
      `http://localhost:${port}${apollo.graphqlPath}`,
    ),
  )
