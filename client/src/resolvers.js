import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    visibilityFilter: VisibilityFilter
  }

  type VisibilityFilter {
    project: Project
    version: Version
    team: Team
  }

  extend type Mutation {
    toggleFilter(id: ID!, name: String!, type: String!): Int
  }
`;

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

const GET_PROJECT_ID = gql`
  query GetProjectId {
    visibilityFilter @client {
      project {
        id
      }
    }
  }
`;

const GET_VERSION_ID = gql`
  query GetVersionId {
    visibilityFilter @client {
      version {
        id
      }
    }
  }
`;

// const GET_TEAM_ID = gql`
//   query GetTeamId {
//     visibilityFilter @client {
//       team {
//         id
//       }
//     }
//   }
// `;

export const resolvers = {
  Query: {
    visibilityFilter: (_root, __, { cache }) => (
      cache.readQuery({ query: GET_VISIBILITY_FILTER })
    ),
    projectId: (_root, __, { cache }) => (
      cache.readQuery({ query: GET_PROJECT_ID }).visibilityFilter.project.id
    ),
    versionId: (_root, __, { cache }) => (
      cache.readQuery({ query: GET_VERSION_ID }).visibilityFilter.version.id
    ),
    teamId: (_root, __, { cache }) => (
      null // cache.readQuery({ query: GET_TEAM_ID }).visibilityFilter.team.id
    ),
  },
  Mutation: {
    toggleFilter: (_root, { value, label, __typename: type }, { cache }) => {
      const { visibilityFilter } = cache.readQuery({ query: GET_VISIBILITY_FILTER });

      visibilityFilter[type.toLowerCase()] = value
        ? { id: value, name: label, __typename: type }
        : null;

      cache.writeData({ data: { visibilityFilter } });
      localStorage.setItem('visibilityFilter', JSON.stringify(visibilityFilter));

      return null;
    },
  },
};
