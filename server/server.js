const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config({ path: '.env' });
require('./db');

// Constants
const { NODE_ENV, PORT } = process.env;

// App
const app = express();

// Bodyparser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Router
app.use('/', require('./routes'));

// Static Files
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Server
app.listen(PORT);
console.log(`Running on http://localhost:${PORT}`);
