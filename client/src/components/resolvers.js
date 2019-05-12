import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`

export const resolvers = {
  Mutation: {
    toggleProject: (_root, { project: filter }, { cache }) => {
      const project = filter
        ? {
            id: filter.value,
            name: filter.label,
            __typename: '__Project',
          }
        : null
      cache.writeData({ data: { project } })
      localStorage.setItem('project', JSON.stringify(project))
    },
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
      const team = filter
        ? {
            id: filter.value,
            name: filter.label,
            __typename: 'Team',
          }
        : null
      cache.writeData({ data: { team } })
      localStorage.setItem('team', JSON.stringify(team))
    },
  },
}
