import { gql } from "@apollo/client"

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    filter: Filter
  }

  type Filter {
    project: Project
    status: Status
    version: Version
    team: Team
  }

  extend type Mutation {
    toggleFilter(id: ID, name: String, type: String): Int
  }
`

const GET_FILTER = gql`
  query GetFilter {
    filter @client {
      project {
        id
        name
      }
      version {
        id
        name
      }
      team {
        id
        name
      }
      status {
        id
        name
      }
    }
  }
`

export const resolvers = {
  // Query: {
  //   isLoggedIn: (_root, args, { cache }, info) => {
  //     console.log(cache);
  //     return !!localStorage.getItem("token");
  //   }
  // },
  Mutation: {
    toggleFilter: (
      _root,
      { id = null, name = null, type = null },
      { cache }
    ) => {
      const { filter } = cache.readQuery({ query: GET_FILTER })
      filter[type.toLowerCase()] = { id, name, __typename: type }
      cache.writeData({ data: { filter, __typename: "Filter" } })
      localStorage.setItem("filter", JSON.stringify(filter))
    },
  },
}
