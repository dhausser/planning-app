import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { ApolloConsumer, Mutation } from 'react-apollo'
import { withRouter } from 'react-router'
import gql from 'graphql-tag'
import Modal, { ModalTransition } from '@atlaskit/modal-dialog'
import Spinner from '@atlaskit/spinner'
import EmptyState from '@atlaskit/empty-state'

const LOGIN_USER = gql`
  mutation login($oauthVerifier: String!) {
    login(oauthVerifier: $oauthVerifier)
  }
`

const REQUEST_TOKEN = gql`
  query requestToken {
    requestToken
  }
`

function Login() {
  const [oauthVerifier, setOauthVerifier] = useState()
  const {
    data: { requestToken },
    loading,
    error,
  } = useQuery(REQUEST_TOKEN)

  if (loading) return <Spinner size="medium" />
  if (error) return <EmptyState header="Error" description={error.message} />

  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({ login }) => {
            if (login) {
              console.log({ login })
              localStorage.setItem('token', login)
              client.writeData({ data: { isLoggedIn: true } })
            }
          }}
        >
          {(login, { error }) => {
            if (error)
              return <EmptyState header="Error" description={error.message} />

            const actions = [
              {
                text: 'Login with Jira',
                onClick: () => authenticate(client, requestToken),
              },
            ]

            const { search } = window.location
            if (search) {
              const url = new URL(window.location)
              const searchParams = new URLSearchParams(url.search)
              window.history.pushState({}, document.title, '/')
              try {
                const param = searchParams.get('oauth_verifier')
                setOauthVerifier(param)
                login({ variables: { oauthVerifier: param } })
              } catch (err) {
                return <EmptyState header="Error" description={err.message} />
              }
            }

            return (
              <>
                {requestToken && !oauthVerifier && (
                  <ModalTransition>
                    <Modal actions={actions} heading="Hi there 👋">
                      <p>
                        In order to proceed please authorise this app to access
                        your Jira data
                      </p>
                    </Modal>
                  </ModalTransition>
                )}
              </>
            )
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  )
}
export default withRouter(Login)

function authenticate(client, requestToken) {
  window.location.replace(
    `https://jira.cdprojektred.com/plugins/servlet/oauth/authorize?oauth_token=${requestToken}`,
  )
  client.writeData({ data: { isLoggedIn: true } })
}
