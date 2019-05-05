import { gql } from 'apollo-server-express'

export const resolvers = {
  Query: {
    issues: async (_, { jql, pageSize = 20, after = 0 }, { dataSources }) =>
      dataSources.issueAPI.getAllIssues(jql, pageSize, after),
    issue: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getIssueById({ issueId: id }),
    versions: async (_, { id, pageSize = 4, after = 4 }, { dataSources }) =>
      dataSources.issueAPI.getAllVersions(id, pageSize, after),
    resources: (_, __, { dataSources }) =>
      dataSources.resourceAPI.getResources(),
    resource: (_, { id }, { dataSources }) =>
      dataSources.resourceAPI.getResourceById({ resourceId: id }),
    teams: async (_, __, { dataSources }) => dataSources.resourceAPI.getTeams(),
    team: async (_, { id }, { dataSources }) =>
      dataSources.resourceAPI.getResourcesByTeam({ teamId: id }),
    absences: (_, { id }, { dataSources }) =>
      dataSources.absenceAPI.getAbsencesById({ userId: id }),
  },
  Mutation: {
    editIssue: async (_, { issueId, summary }, { dataSources }) =>
      dataSources.issueAPI.editIssue({ issueId, summary }),
  },
}

export const typeDefs = gql`
  type Query {
    issues(jql: String, pageSize: Int, after: String): IssueConnection!
    issue(id: ID!): Issue
    versions(id: ID!, pageSize: Int, after: Int): [FixVersion]
    resources: [Resource]!
    resource(id: ID!): Resource
    teams: [Team]!
    team(id: ID!): Team
    absences(id: ID!): [Absence]!
    me: User
  }

  type IssueConnection {
    startAt: Int!
    maxResults: Int!
    total: Int!
    issues: [Issue]!
  }

  type Issue {
    id: ID!
    key: String!
    summary: String!
    priority: String!
    type: String!
    description: String
    status: Status!
    fixVersions: [FixVersion]
    assignee: Resource
    reporter: Resource
    comments: [Comment]
    children: [Issue]
    parent: String
  }

  type Comment {
    id: ID!
    author: Resource!
    body: String!
    created: String!
    updated: String
  }

  type Status {
    id: ID!
    name: String!
    category: String!
  }

  type FixVersion {
    id: ID!
    name: String!
    description: String
  }

  type Resource {
    key: ID
    name: String
    team: String
  }

  type Team {
    _id: ID!
    size: Int!
    members: [Resource]!
  }

  type Absence {
    key: String!
    date: String!
  }

  type User {
    id: ID!
    email: String!
    issues: [Issue]!
    absences: [Absence]!
    team: Team!
  }

  type Mutation {
    # if false, issue update failed -- check erros
    editIssue(issueId: ID!, summary: String): Int
    login(email: String): String # login token
  }

  type IssueUpdateResponse {
    success: Boolean!
    message: String
    issue: Issue
  }
`
