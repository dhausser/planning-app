import "dotenv/config";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import redis from "redis";
import connectRedis from "connect-redis";
import { ApolloServer } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";

import passport from "./utils";
import routes from "./routes";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import UserAPI from "./datasources/user";
import IssueAPI from "./datasources/issue";
import AbsenceAPI from "./datasources/absence";

const app = express();
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();

// const RedisStore = connectRedis(session);
// const redisClient = redis.createClient({ password: process.env.REDIS_PWD });

app.use(cookieParser());
app.use(
  session({
    // store: new RedisStore({ client: redisClient }),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error(error);
    return error;
  },
  context: ({ req, res }) => ({
    token: req.cookies.token,
    user: req.user,
    res,
  }),
  dataSources: () => ({
    issueAPI: new IssueAPI({ prisma }),
    absenceAPI: new AbsenceAPI(),
    userAPI: new UserAPI({ prisma }),
  }),
});

apolloServer.applyMiddleware({ app });

app.listen(port, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  )
);
