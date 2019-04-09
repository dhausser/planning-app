const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.connection.on(
  'error',
  console.error.bind(console, 'connection error:')
);
mongoose.connection.once('open', () => console.log('Connected to mongoDB!'));
