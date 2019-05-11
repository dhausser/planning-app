import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    version: FixVersion
    versions: [FixVersion]
    team: String
    teams: [Team]
  }

  extend type Team {
    id: ID!
    filter: String
  }
`

export const resolvers = {
  Mutation: {
    toggleVersion: (_root, { version: filter }, { cache }) => {
      const version = filter
        ? {
            id: filter.value,
            name: filter.label,
            __typename: 'FixVersion',
          }
        : null
      cache.writeData({ data: { version } })
      localStorage.setItem('version', JSON.stringify(version))
    },
    toggleTeam: (_root, { team: filter }, { cache }) => {
      const team = filter ? filter.value : null
      cache.writeData({ data: { team } })
      localStorage.setItem('team', team)
    },
  },
}
