const { sign } = require('oauth-sign');
const { consumerKey, consumerSecret } = require('../utils');

module.exports = class Oauth {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  sign(req, oauthToken) {
    const { method, path: addressPath, params } = req;
    const oauthVersion = '1.0';
    const signatureMethod = 'RSA-SHA1';
    const baseURI = `${this.baseURL}${addressPath}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.random().toString(36).substring(2, 15);
    const requestParams = Object.fromEntries(params.entries());

    // Assemble Oauth parameters
    const oauthParams = {
      ...requestParams,
      oauth_consumer_key: consumerKey,
      oauth_nonce: nonce,
      oauth_signature_method: signatureMethod,
      oauth_timestamp: timestamp,
      oauth_token: oauthToken,
      oauth_version: oauthVersion,
    };

    // Generate Oauth signature
    const oauthSignature = encodeURIComponent(
      sign(signatureMethod, method, baseURI, oauthParams, consumerSecret),
    );

    // Compose Oauth authorization header
    return `OAuth\
      oauth_consumer_key="${consumerKey}",\
      oauth_nonce="${nonce}",\
      oauth_signature="${oauthSignature}",\
      oauth_signature_method="${signatureMethod}",\
      oauth_timestamp="${timestamp}",\
      oauth_token="${oauthToken}",\
      oauth_version="${oauthVersion}"`;
  }
};
