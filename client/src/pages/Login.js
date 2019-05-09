import React from 'react'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

import { Signin, Loading, Error } from '../components'

const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`

export default function Login() {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({ login }) => {
            localStorage.setItem('token', login)
            client.writeData({ data: { isLoggedIn: true } })
          }}
        >
          {(login, { loading, error }) => {
            if (loading) return <Loading />
            if (error) return <Error error={error} />
            return <Signin login={login} />
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  )
}
