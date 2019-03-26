const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

require('./db');

// Constants
const PORT = 8080;

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
// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// Server
app.listen(PORT);
console.log(`Running on http://localhost:${PORT}`);
