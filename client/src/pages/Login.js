import React from 'react'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

import { LoginForm, Error } from '../components'

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    basicAuth(username: $username, password: $password)
  }
`

export default function Login() {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({ basicAuth }) => {
            console.log(basicAuth)
            if (basicAuth) {
              localStorage.setItem('token', basicAuth)
              client.writeData({ data: { isLoggedIn: true } })
            }
          }}
        >
          {(login, { error }) => {
            if (error) return <Error error={error} />

            return <LoginForm login={login} />
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  )
}
