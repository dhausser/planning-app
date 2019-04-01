// Entry point for the app

// Express is the underlying that atlassian-connect-express uses:
const express = require('express');

// https://expressjs.com/en/guide/using-middleware.html
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');
// const morgan = require('morgan');

// atlassian-connect-express also provides a middleware
// const ace = require('atlassian-connect-express');

// We also need a few stock Node modules
const http = require('http');
const path = require('path');
const os = require('os');

// Mongoose
require('./db');

// Routes live here; this is the C in MVC
const routes = require('./routes');

// Bootstrap Express and atlassian-connect-express
const app = express();
// const addon = ace(app);

// See config.json
const port = 4444; // addon.config.port();
app.set('port', port);

// Log requests, using an appropriate formatter by env
const devEnv = app.get('env') === 'development';
// app.use(morgan('combined'));

// Include request parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Gzip response when appropriate
app.use(compression());

// Include atlassian-connect-express middleware
// app.use(addon.middleware());

// Mount the static files directory
const staticDir = path.join(__dirname, 'build');
app.use(express.static(staticDir));

// Show nicer errors in dev mode
if (devEnv) app.use(errorHandler());

// Wire up routes
app.use('/', routes);

// Boot the HTTP server
http.createServer(app).listen(port, () => {
  console.log(`App server running at http://${os.hostname()}:${port}`);

  // Enables auto registration/de-registration of app into a host in dev mode
  // if (devEnv) addon.register();
});
