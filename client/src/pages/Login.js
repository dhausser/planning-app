import React from 'react'
import gql from 'graphql-tag'
import { ApolloConsumer, Mutation } from 'react-apollo'
import { LoginForm, Loading } from '../components'

const LOGIN_USER = gql`
  mutation login {
    login
  }
`
// const LOGIN_USER = gql`
//   mutation login($token: String!) {
//     login(token: $token)
//   }
// `

export default () => (
  <ApolloConsumer>
    {client => (
      <Mutation
        mutation={LOGIN_USER}
        onCompleted={({ login }) => {
          console.log({ login })
          localStorage.setItem('token', login)
          client.writeData({ data: { isLoggedIn: true } })
        }}
      >
        {(login, { loading, error }) => {
          if (loading) return <Loading />
          if (error) return <p>An error occurred</p>

          return <LoginForm login={login} />
        }}
      </Mutation>
    )}
  </ApolloConsumer>
)
