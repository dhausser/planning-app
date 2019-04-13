import { ApolloServer } from 'apollo-server'
import { MongoClient } from 'mongodb'
import typeDefs from './schema'
import resolvers from './resolvers'
import ResourcesDAO from './dao/resourcesDAO'
import IssueAPI from './datasources/issue'
import AbsenceAPI from './datasources/absence'
import ResourceAPI from './datasources/resource'

MongoClient.connect(process.env.DATABASE, { useNewUrlParser: true })
  .catch(err => {
    console.log(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await ResourcesDAO.injectDB(client)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI(),
  }),
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
