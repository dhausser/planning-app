import React from 'react'
import { render } from 'react-dom'
import '@atlaskit/css-reset'

import { Query, ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { resolvers, typeDefs } from './components/resolvers'

import { Login, AppRouter } from './pages'
import { IS_LOGGED_IN } from './components/queries'

const httpLink = createHttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: `Basic ${token}`,
    },
  }
})

const cache = new InMemoryCache()
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  resolvers,
  typeDefs,
})

const project = localStorage.getItem('project')
  ? JSON.parse(localStorage.getItem('project'))
  : null
const version = localStorage.getItem('version')
  ? JSON.parse(localStorage.getItem('version'))
  : null
const team = localStorage.getItem('team')
  ? JSON.parse(localStorage.getItem('team'))
  : null

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
    project,
    version,
    team,
  },
})

render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Query query={IS_LOGGED_IN}>
        {({ data }) =>
          data.isLoggedIn ? <AppRouter client={client} /> : <Login />
        }
      </Query>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('root'),
)
