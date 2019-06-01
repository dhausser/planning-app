import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import path from 'path'
import createStore from './utils'
import resolvers from './resolvers'
import typeDefs from './schema'

import IssueAPI from './datasources/issue'
import AbsenceAPI from './datasources/absence'
import ResourceAPI from './datasources/resource'

const store = createStore()

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.log(error)
    return error
  },
  context: ({ req }) => ({
    auth: req.headers.authorization,
  }),
  dataSources: () => ({
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI({ store }),
  }),
})

const app = express()
const port = process.env.NODE_ENV === 'production' ? 8080 : 4000
apollo.applyMiddleware({ app })

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${apollo.graphqlPath}`,
  ),
)
