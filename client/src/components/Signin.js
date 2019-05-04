import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './Error'
import { CURRENT_USER_QUERY } from './User'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

const Signin = () => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  return (
    <Mutation
      mutation={SIGNIN_MUTATION}
      variables={{ name, password, email }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signup, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async e => {
            e.preventDefault()
            await signup()
            setName('')
            setPassword('')
            setEmail('')
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Sign into your account</h2>
            <Error error={error} />
            <label htmlFor="email">
              Email
              <input
                type="email"
                name="email"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </label>

            <button type="submit">Sign In!</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  )
}

export default Signin
