import { makeExecutableSchema } from "graphql-tools";
import { typeDefs } from "../server/src/schema";
import { resolvers } from "../server/src/resolvers";

// import { typeDefs } from './type-defs';
// import { resolvers } from './resolvers';

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
