import gql from 'graphql-tag';

const GET_VISIBILITY_FILTER = gql`
  query GetVisibilityFilter {
    visibilityFilter @client {
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

const getType = {
  Project: 'project',
  FixVersion: 'version',
  Team: 'team',
};

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    visibilityFilter: VisibilityFilter
  }

  type VisibilityFilter {
    project: Project
    version: FixVersion
    team: Team
  }

  extend type Mutation {
    toggleFilter(id: ID!, name: String!, type: String!): Int
  }
`;

export const resolvers = {
  Mutation: {
    toggleFilter: (_root, { value, label, __typename }, { cache }) => {
      const { visibilityFilter } = cache.readQuery({ query: GET_VISIBILITY_FILTER });
      // eslint-disable-next-line no-underscore-dangle
      const type = getType[__typename];
      const update = value ? { id: value, name: label, __typename } : null;
      visibilityFilter[type] = update;
      const data = { ...visibilityFilter };
      cache.writeData({ data });
      localStorage.setItem('visibilityFilter', JSON.stringify(visibilityFilter));
      return null;
    },
  },
};
