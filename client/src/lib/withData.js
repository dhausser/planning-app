import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { resolvers, typeDefs } from '../resolvers'

/**
 * TODO: Authentication
 */
import { basicAuth, apiKey, defaultFixVersion } from '../credentials'

/**
 * TODO: Change production endpoint
 */
export default function createClient() {
  const httpLink = createHttpLink({
    uri: '/graphql',
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

  const team =
    localStorage.getItem('team') === null ? localStorage.getItem('team') : null
  const version =
    JSON.parse(localStorage.getItem('version')) || defaultFixVersion

  cache.writeData({
    data: {
      isLoggedIn: false,
      version,
      team,
    },
  })

  return client
}
