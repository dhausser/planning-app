/* eslint-disable no-global-assign */
require('dotenv').config();

require = require('esm')(module);

module.exports = process.env.PLATFORM === 'cloud'
  ? require('./src/server')
  : require('./src/index');
