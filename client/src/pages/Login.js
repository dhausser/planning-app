import React from 'react'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

import { LoginForm, Loading, Error } from '../components'

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`

export default function Login() {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({ login }) => {
            console.log(login)
            localStorage.setItem('token', btoa(login))
            client.writeData({ data: { isLoggedIn: true } })
          }}
        >
          {(login, { loading, error }) => {
            if (loading) return <Loading />
            if (error) return <Error error={error} />

            return <LoginForm login={login} />
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  )
}
