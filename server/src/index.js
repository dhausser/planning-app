import "dotenv/config"
import express from "express"
import session from "express-session"
import { ApolloServer } from "apollo-server-express"

import passport from "./passport"
import routes from "./routes"
import createStore from "./db"
import typeDefs from "./schema"
import resolvers from "./resolvers"
import IssueAPI from "./datasources/issue"
import AbsenceAPI from "./datasources/absence"
import ResourceAPI from "./datasources/resource"

/**
 * TO TEST: Solution proposed here: https://github.com/apollographql/apollo-server/issues/3178
 */

const app = express()
const port = process.env.NODE_ENV === "production" ? 8080 : 4000
app.use(
  session({
    secret: "keyboard cat",
    // resave: false,
    // saveUninitialized: true,
    // cookie: {},
  })
)
app.use(passport.initialize())
app.use(passport.session())
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.error(error)
    return error
  },
  context: ({ req }) => ({
    authorization: req.headers.authorization,
    user: req.user,
  }),
  dataSources: () => ({
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI({ store: createStore() }),
  }),
})

app.use("/", routes)
server.applyMiddleware({ app, path: "/graphql", cors: false })

app.listen(port, () =>
  console.log(`Server ready at http://localhost:${port}${apollo.graphqlPath}`)
)
