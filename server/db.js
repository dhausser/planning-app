const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.DATABASE, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => {
  console.error(err.message);
});

require('./models/Resource');
require('./models/Issue');
require('./models/Holiday');
