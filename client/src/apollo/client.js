import ApolloClient, { InMemoryCache, HttpLink } from "apollo-boost"
import { resolvers, typeDefs } from "./resolvers"
import fetch from "isomorphic-fetch"

/** TODO: Check that this actually works */
let client = null

if (typeof localStorage !== `undefined`) {
  client = new ApolloClient({
    link: new HttpLink({
      uri: "/graphql",
      credentials: "same-origin",
      headers: {
        authorization: localStorage.getItem("token"),
      },
      fetch,
    }),
    cache: new InMemoryCache({
      data: {
        isLoggedIn: !!localStorage.getItem("token"),
        projectId: localStorage.getItem("projectId"),
        versionId: localStorage.getItem("versionId"),
        statusId: localStorage.getItem("statusId"),
        teamId: localStorage.getItem("teamId"),
      },
    }),
    resolvers,
    typeDefs,
  })
}

export default client
