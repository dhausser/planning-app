import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    versionFilter: FixVersion
    teamFilter: String
  }
`

export const resolvers = {
  Mutation: {
    toggleVersion: (_root, { version }, { cache }) => {
      cache.writeData({
        data: {
          versionFilter: version,
          versionId: version.id,
          versionName: version.name,
        },
      })
      console.log(version)
      return null
    },
  },
}
