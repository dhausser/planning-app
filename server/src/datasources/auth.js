import { RESTDataSource } from 'apollo-datasource-rest'
import fs from 'fs'
import { OAuth } from 'oauth'
import { consumerKey, consumerPrivateKeyFile } from '../../config'

export default class AuthAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `https://${process.env.HOST}/rest/`
  }

  initialize(config) {
    this.context = config.context
  }

  findUser(token) {
    console.log({ token })
    return token
  }

  getRequestToken(callbackURL) {
    const privateKeyData = fs.readFileSync(consumerPrivateKeyFile, 'utf8')

    this.context.consumer = new OAuth(
      `https://${process.env.HOST}/plugins/servlet/oauth/request-token`,
      `https://${process.env.HOST}/plugins/servlet/oauth/access-token`,
      consumerKey,
      privateKeyData,
      '1.0',
      'http://localhost:3000/',
      'RSA-SHA1',
    )

    return (function() {
      return new Promise(function(resolve, reject) {
        this.context.consumer.getOAuthRequestToken(function(
          error,
          oauthToken,
          oauthTokenSecret,
          results,
        ) {
          if (error) {
            console.log(error.data)
            reject(error)
          } else {
            this.context.oauthToken = oauthToken
            this.context.oauthTokenSecret = oauthTokenSecret
            resolve({
              token: oauthToken,
              secret: oauthTokenSecret,
            })
          }
        })
      })
    })()
  }

  getAccessToken(oauthToken, oauthSecret, oauthVerifier) {
    return (function() {
      return new Promise(function(resolve, reject) {
        this.context.consumer.getOAuthAccessToken(
          this.context.oauthToken,
          this.context.oauthTokenSecret,
          oauthVerifier,
          function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
            if (error) {
              console.log(error.data)
              reject(error)
            } else {
              resolve(oauthAccessToken)
            }
          },
        )
      })
    })()
  }
}
