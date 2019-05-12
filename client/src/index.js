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

const team = localStorage.getItem('team') ? localStorage.getItem('team') : null
const version = localStorage.getItem('version')
  ? JSON.parse(localStorage.getItem('version'))
  : null

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
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
