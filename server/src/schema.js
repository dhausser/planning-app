import { buildSchema } from 'graphql'

export default buildSchema(`
  type Query {
    hello: String
    resources: [Resource]
    teams: [Team]
  }

  type Resource {
    id: ID!
    key: String
    name: String
    team: String
  }

  type Team {
    _id: ID!
    size: Int!
    members: [Resource]!
  }
`)
