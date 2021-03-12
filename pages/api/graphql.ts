// https://github.com/apollographql/apollo-server/blob/main/packages/apollo-server-micro/README.md#cors-example

import Cors from "micro-cors";
import { ApolloServer } from "apollo-server-micro";
import { schema } from "../../apollo/schema";

const apolloServer = new ApolloServer({ schema });

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors();

export default cors((req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  return apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
});
