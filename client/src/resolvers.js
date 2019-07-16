import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    filter: Filter
  }

  type Filter {
    project: Project
    version: Version
    team: Team
  }

  extend type Mutation {
    toggleFilter(id: ID!, name: String!, type: String!): Int
  }
`;

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
    }
  }
`;

export const resolvers = {
  Mutation: {
    toggleFilter: (_root, { value, label, __typename: type }, { cache }) => {
      const { filter } = cache.readQuery({ query: GET_FILTER });

      filter[type.toLowerCase()] = value
        ? { id: value, name: label, __typename: type }
        : null;

      cache.writeData({ data: { filter } });
      localStorage.setItem('filter', JSON.stringify(filter));

      return null;
    },
  },
};
