// Entry point for the app

// Express is the underlying that atlassian-connect-express uses:
import express from 'express'
import graphqlHTTP from 'express-graphql'

// https://expressjs.com/en/guide/using-middleware.html
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import errorHandler from 'errorhandler'
// import morgan from 'morgan'

// atlassian-connect-express also provides a middleware
// import ace from 'atlassian-connect-express'

// We also need a few stock Node modules
import http from 'http'
import path from 'path'
import os from 'os'

// GraphQL Modules
import root from './resolvers'
import schema from './schema'

// MongoDB
import './db'

// Routes live here; this is the C in MVC
import routes from './routes'

// Bootstrap Express and atlassian-connect-express
const app = express()
// const addon = ace(app);

// See config.json
const port = process.env.PORT // addon.config.port();
app.set('port', port)

// Log requests, using an appropriate formatter by env
const devEnv = app.get('env') === 'development'
// app.use(morgan('combined'));

// Include request parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Gzip response when appropriate
app.use(compression())

// Include atlassian-connect-express middleware
// app.use(addon.middleware());

// Mount the static files directory
const staticDir = path.join(__dirname, 'build')
app.use(express.static(staticDir))

// Show nicer errors in dev mode
if (devEnv) app.use(errorHandler())

// Wire up routes
app.use('/', routes)

// Route to GraphQL
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
)

// Boot the HTTP server
http.createServer(app).listen(port, () => {
  console.log(`App server running at http://${os.hostname()}:${port}`)

  // Enables auto registration/de-registration of app into a host in dev mode
  // if (devEnv) addon.register();
})
