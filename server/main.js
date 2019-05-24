require('dotenv').config()
// eslint-disable-next-line no-global-assign
require = require('esm')(module)

module.exports = require('./src/index')
// module.exports = require('./src/oauth')
