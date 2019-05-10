const path = require('path')
const homedir = require('os').homedir()

module.exports = {
  consumerPrivateKeyFile: path.join(homedir, 'jira_privatekey.pem'),
  consumerKey: 'RDM',
}
