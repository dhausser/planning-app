import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { Query, ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'
import { resolvers, typeDefs } from './resolvers'
import '@atlaskit/css-reset'
import App from './components/App'
// import Login from './pages/Login'
import { basicAuth, apiKey, defaultFixVersion } from './credentials'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'same-origin',
})
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token')
  const token = apiKey
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : `Basic ${basicAuth}`,
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

cache.writeData({
  data: {
    isLoggedIn: false,
    versionFilter: localStorage.getItem('version')
      ? JSON.parse(localStorage.getItem('version'))
      : defaultFixVersion,
    teamFilter: localStorage.getItem('team'),
  },
})

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`

ReactDOM.render(
  <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN}>
      {({ data }) => (data.isLoggedIn ? <App /> : <App />)}
    </Query>
  </ApolloProvider>,
  document.getElementById('root'),
)

/**
 * TODO: Handle authentication
 */
// const httpLink = createHttpLink({
//   uri: 'http://localhost:4000/graphql',
//   credentials: 'same-origin',
// })
// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   // const token = localStorage.getItem('token')
//   const token = apiKey
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : `Basic ${basicAuth}`,
//     },
//   }
// })
