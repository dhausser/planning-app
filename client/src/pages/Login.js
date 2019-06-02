import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { ApolloConsumer, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Modal, { ModalTransition } from '@atlaskit/modal-dialog'
import Spinner from '@atlaskit/spinner'
import EmptyState from '@atlaskit/empty-state'

const LOGIN_USER = gql`
  mutation login(
    $oauthToken: String!
    $oauthSecret: String!
    $oauthVerifier: String!
  ) {
    login(
      oauthToken: $oauthToken
      oauthSecret: $oauthSecret
      oauthVerifier: $oauthVerifier
    )
  }
`

const REQUEST_TOKEN = gql`
  query oauthRequest {
    oauthRequest {
      token
      secret
    }
  }
`

export default () => {
  const [temp, setTemp] = useState(false)
  const { data, loading, error } = useQuery(REQUEST_TOKEN)

  if (loading) return <Spinner size="medium" />
  if (error) return <EmptyState header="Error" description={error.message} />

  const { token, secret } = data.oauthRequest

  console.log({ data })

  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({ login }) => {
            if (login) {
              console.log({ login })
              // localStorage.setItem('token', login)
              // client.writeData({ data: { isLoggedIn: true } })
            }
          }}
        >
          {(login, { error }) => {
            if (error)
              return <EmptyState header="Error" description={error.message} />

            const actions = [
              {
                text: 'Login with Jira',
                onClick: () => authenticate(client, token),
              },
            ]

            /**
             * TODO: Ensure this code run only once per flow
             */
            const { search } = window.location
            if (search) {
              const url = new URL(window.location)
              const searchParams = new URLSearchParams(url.search)
              window.history.pushState({}, document.title, '/')
              try {
                const oauthToken = searchParams.get('oauth_token')
                const oauthSecret = secret
                const oauthVerifier = searchParams.get('oauth_verifier')
                setTemp(true)
                login({
                  variables: { oauthToken, oauthSecret, oauthVerifier },
                })
              } catch (err) {
                return <EmptyState header="Error" description={err.message} />
              }
            }

            return (
              <>
                {token && !temp ? (
                  <ModalTransition>
                    <Modal actions={actions} heading="Hi there 👋">
                      <p>
                        In order to proceed please authorise this app to access
                        your Jira data
                      </p>
                    </Modal>
                  </ModalTransition>
                ) : (
                  <p>Trying to login...</p>
                )}
              </>
            )
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  )
}

function authenticate(client, requestToken) {
  window.location.replace(
    `https://jira.cdprojektred.com/plugins/servlet/oauth/authorize?oauth_token=${requestToken}`,
  )
  client.writeData({ data: { isLoggedIn: true } })
}
