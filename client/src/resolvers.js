import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    version: FixVersion
    team: Team
  }

  extend type Team {
    id: ID!
    filter: String
  }
`

export const resolvers = {
  Mutation: {
    toggleVersion: (_root, { version }, { cache }) => {
      cache.writeData({ data: { version } })
      localStorage.setItem('version', JSON.stringify(version))
    },
    toggleTeam: (_root, { team: { id, filter } }, { cache }) => {
      const team = filter && filter === id ? null : id
      cache.writeData({ data: { team } })
      localStorage.setItem('team', team)
    },
  },
}
