import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client"
import fetch from "isomorphic-fetch"
import { resolvers, typeDefs } from "./schema"

let token = null
if (typeof localStorage !== `undefined`) {
  token = localStorage.getItem("token")
}

const cache = new InMemoryCache()

const httpLink = new HttpLink({ uri: "/graphql" })

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: token || null,
    },
  })

  return forward(operation)
})

const client = new ApolloClient({
  cache,
  link: concat(authMiddleware, httpLink),
  resolvers,
  typeDefs,
  fetch,
})

if (typeof localStorage !== `undefined`) {
  const data = {
    isAuthenticated: !!token,
    projectId: localStorage.getItem("projectId"),
    versionId: localStorage.getItem("versionId"),
    statusId: localStorage.getItem("statusId"),
    teamId: localStorage.getItem("teamId"),
  }
  cache.writeData({ data })
}

export default client
