import { ApolloServer } from 'apollo-server'

import resolvers from './resolvers'
import typeDefs from './schema'

import IssueAPI from './datasources/issue'
import AbsenceAPI from './datasources/absence'
import ResourceAPI from './datasources/resource'

import './db'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.log(error)
    return error
  },
  context: ({ req }) => {
    const token = req.headers.authorization || ''
    const user = () => ({ id: 'davy.hausser', name: 'Davy Hausser' })
    return { user, token }
  },
  dataSources: () => ({
    issueAPI: new IssueAPI(),
    absenceAPI: new AbsenceAPI(),
    resourceAPI: new ResourceAPI(),
  }),
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
