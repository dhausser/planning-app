const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.DATABASE, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

require('./models/Resource');
require('./models/Issue');
require('./models/Holiday');

const app = express();

app.use('/', require('./routes/index'));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
