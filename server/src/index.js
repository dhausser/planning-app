import express from 'express'
import { ApolloServer, AuthorizationError } from 'apollo-server-express'
import { MongoClient } from 'mongodb'
import path from 'path'
import atob from 'atob'
import resolvers from './resolvers'
import typeDefs from './schema'

import IssueAPI from './datasources/issue'
import AbsenceAPI from './datasources/absence'
import ResourceAPI from './datasources/resource'

const issueAPI = new IssueAPI()
const absenceAPI = new AbsenceAPI()
const resourceAPI = new ResourceAPI()

MongoClient.connect(process.env.DATABASE, { useNewUrlParser: true })
  .catch(err => {
    console.log(err.stack)
    process.exit(1)
  })
  .then(async client => ResourceAPI.injectDB(client))

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.log(error)
    return error
  },
  context: ({ req }) => initContext(req),
  dataSources: () => ({ issueAPI, absenceAPI, resourceAPI }),
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

const initContext = async req => {
  // get the user token from the headers
  const token = req.headers.authorization || ''

  // try to retrieve a user with the token
  const user = atob(token.split(' ')[1]).split(':')[0]

  // optionally block the user
  // we could also check user roles/permissions here
  if (!user) throw new AuthorizationError('you must be logged in')

  const resources = await ResourceAPI.getResources()

  const map = resources.reduce((acc, resource) => {
    acc[resource.key] = resource.team
    return acc
  }, {})

  // add the user to the context
  return { user, token, map }
}
