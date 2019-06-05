import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import errorhandler from 'errorhandler'
import morgan from 'morgan'
import routes from './routes'
import createStore from './db'
import resolvers from './resolvers'
import typeDefs from './schema'

import AuthAPI from './datasources/auth'
import IssueAPI from './datasources/issue'
import AbsenceAPI from './datasources/absence'
import ResourceAPI from './datasources/resource'

const app = express()
const port = process.env.PORT
const store = createStore()

app.use(errorhandler())
app.use(cookieParser())
app.use(
  morgan('combined', {
    skip(req, res) {
      return res.statusCode < 400
    },
  }),
)
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {},
  }),
)

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.log(error)
    return error
  },
  context: ({ req }) => ({
    auth: req.headers.authorization,
  }),
  dataSources: () => ({
    authAPI: new AuthAPI(),
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI({ store }),
  }),
})

apollo.applyMiddleware({ app })

app.use('/', routes)

app.listen(port, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${apollo.graphqlPath}`,
  ),
)
