import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import errorhandler from 'errorhandler'
import bodyParser from 'body-parser'
import passport from 'passport'
import routes from './routes'
import createStore from './db'
import resolvers from './resolvers'
import typeDefs from './schema'

import IssueAPI from './datasources/issue'
import AbsenceAPI from './datasources/absence'
import ResourceAPI from './datasources/resource'

import './auth'

const app = express()
const port = process.env.PORT
const store = createStore()

app.use(errorhandler())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {},
  }),
)
app.use(passport.initialize())
app.use(passport.session())
app.use('/', routes)

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.log(error)
    return error
  },
  context: ({ req }) => ({
    auth: req.headers.authorization,
    user: req.user,
  }),
  dataSources: () => ({
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI({ store }),
  }),
})

apollo.applyMiddleware({ app })

app.listen(port, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${apollo.graphqlPath}`,
  ),
)
