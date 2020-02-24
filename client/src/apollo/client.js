import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import fetch from "node-fetch"
// import fetch from "isomorphic-fetch"
import { resolvers, typeDefs } from "./schema"

/**
 * TODO: Replace with environment variable GATSBY_API_URL
 */
const API_URL = "http://localhost:4000/graphql"
export const isBrowser = typeof localStorage !== "undefined"

let token = null
if (isBrowser) {
  token = localStorage.getItem("token")
}

const cache = new InMemoryCache()

const client = new ApolloClient({
  link: new HttpLink({
    uri: API_URL,
    fetch,
    credentials: "include",
    headers: {
      authorization: token || null,
    },
  }),
  cache,
  resolvers,
  typeDefs,
})

if (isBrowser) {
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
