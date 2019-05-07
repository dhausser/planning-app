import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    version: FixVersion
    versions: [FixVersion]
    team: Team
    teams: [Team]
  }

  extend type Team {
    id: ID!
    filter: String
  }
`

export const resolvers = {
  Mutation: {
    toggleVersion: (_root, { version: update }, { cache }) => {
      if (update) {
        const version = {
          id: update.value,
          name: update.label,
          __typename: 'FixVersion',
        }
        cache.writeData({ data: { version } })
        localStorage.setItem('version', JSON.stringify(version))
      }
    },
    toggleTeam: (_root, { team: update }, { cache }) => {
      const team = update ? update.value : null
      cache.writeData({ data: { team } })
      localStorage.setItem('team', team)
    },
  },
}
