import fetch from "isomorphic-fetch"
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { resolvers, typeDefs } from "./schema"

export const port = process.env.NODE_ENV === "production" ? 8080 : 4000
export const isBrowser = typeof localStorage !== "undefined"

let token = null
if (isBrowser) {
  token = localStorage.getItem("token")
}

const cache = new InMemoryCache()
const client = new ApolloClient({
  link: new HttpLink({
    uri: `http://localhost:${port}/graphql`,
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
