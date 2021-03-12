import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  HttpLink,
  gql,
} from "@apollo/client";

const endpoint =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PRODUCTION_ENDPOINT
    : "/graphql";

// Set up our apollo-client to point at the server we created
// this can be local or a remote endpoint
const cache = new InMemoryCache();
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: endpoint,
    credentials: "same-origin",
    headers: {
      authorization:
        typeof window !== "undefined" ? localStorage.getItem("token") : null,
    },
  }),
});

function writeInitialData(): Promise<unknown> {
  if (typeof window !== "undefined") {
    cache.writeQuery({
      query: gql`
        query {
          isLoggedIn @client
          projectId @client
          versionId @client
          statusId @client
          teamId @client
          networkStatus @client {
            isConnected
          }
        }
      `,
      data: {
        isLoggedIn: !!localStorage.getItem("token"),
        projectId: localStorage.getItem("projectId"),
        versionId: localStorage.getItem("versionId"),
        statusId: localStorage.getItem("statusId"),
        teamId: localStorage.getItem("teamId"),
      },
    });
  }
  return new Promise((resolve) => resolve(null));
}

writeInitialData();

client.onResetStore(writeInitialData);

export default client;
