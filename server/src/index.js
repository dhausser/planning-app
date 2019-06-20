import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import errorhandler from 'errorhandler'
import morgan from 'morgan'
// import bodyParser from 'body-parser'
import passport from 'passport'
// import routes from './routes'
import createStore from './db'
import resolvers from './resolvers'
import typeDefs from './schema'

import AuthAPI from './datasources/auth'
import IssueAPI from './datasources/issue'
import AbsenceAPI from './datasources/absence'
import ResourceAPI from './datasources/resource'

import './auth'

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

app.use(passport.initialize())
app.use(passport.session())

// passport.serializeUser(function(user, done) {
//   done(null, user)
// })

// passport.deserializeUser(function(user, done) {
//   done(null, user)
// })

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
    authAPI: new AuthAPI(),
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI({ store }),
  }),
})

apollo.applyMiddleware({ app })

// login route for passport || previously: app.use('/', routes)
// app.use(bodyParser.urlencoded({ extended: true }))
app.get(
  '/login',
  passport.authenticate('oauth', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }),
)

app.get(
  '/login/callback',
  passport.authenticate('oauth', { failureRedirect: '/login', session: false }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('Successfully authentication, redirecting home...')
    console.log({ user: req.user })
    req.session.user = req.user
    res.redirect('http://localhost:3000/dashboard')
  },
)

app.listen(port, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${apollo.graphqlPath}`,
  ),
)
