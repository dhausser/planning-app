/// <reference path="../node.d.ts"/>
import { sign } from 'oauth-sign';
import { consumerKey, consumerSecret } from '../utils';

export default class Oauth {
  baseURL: string;
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  sign(req: { headers?: { set: (arg0: string, arg1: string) => void; }; method?: any; path?: any; params?: any; }, oauthToken: any) {
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
