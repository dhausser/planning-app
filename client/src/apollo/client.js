import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from "isomorphic-fetch"
import { resolvers, typeDefs } from "./resolvers"

let token;
if (typeof localStorage !== `undefined`) {
  token = localStorage.getItem("token");
}

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "same-origin",
    headers: {
      authorization: token,
    },
  }),
  resolvers,
  typeDefs,
  fetch,
});

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
