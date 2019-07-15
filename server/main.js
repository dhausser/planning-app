/* eslint-disable no-global-assign */
require('dotenv').config();

require = require('esm')(module);

module.exports = require('./src/index');
// module.exports = require('./src/server');
