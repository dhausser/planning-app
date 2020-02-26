import "dotenv/config"
import express from "express"
import session from "express-session"
import connectMongo from "connect-mongo"
import cors from "cors"
import { ApolloServer } from "apollo-server-express"
import typeDefs from "./schema"
import resolvers from "./resolvers"
import passport from "./passport"
import routes from "./routes"
import createStore from "./db"
import IssueAPI from "./datasources/issue"
import AbsenceAPI from "./datasources/absence"
import ResourceAPI from "./datasources/resource"

const app = express()
const port = process.env.NODE_ENV === "production" ? 8080 : 4000
const MongoStore = connectMongo(session)
const store = createStore()
/**
 * TODO: Implement CORS options as described in https://www.npmjs.com/package/cors
 */
app.use(
  cors({
    origin: ["http://localhost:8000", "http://localhost:8080"],
    credentials: true,
  })
)
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {},
    store: new MongoStore({ url: process.env.DATABASE }),
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
    resourceAPI: new ResourceAPI({ store }),
  }),
})

app.use("/", routes)

/**
 * SOLUTION: Solution proposed here: https://github.com/apollographql/apollo-server/issues/3178
 */
server.applyMiddleware({ app, path: "/graphql", cors: false })

app.listen(port, () =>
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
)
