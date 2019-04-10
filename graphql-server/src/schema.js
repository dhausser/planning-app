const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    # Queries for Jira issues
    issues(jql: String, pageSize: Int, after: String): IssueConnection!
    issue(id: ID!): Issue
    # Queries for MongoDB Team Resources
    resources: [Resource]!
    resource(id: ID!): Resource
    teams: [Team]!
    team(id: ID!): Team
    # Queries for Portal Absences
    absences(id: ID!): [Absence]!
    # Queries for the current user
    me: User
  }

  type IssueConnection {
    cursor: String!
    hasMore: Boolean!
    issues: [Issue]!
  }

  type Issue {
    id: ID!
    key: String!
    summary: String!
    priority: String!
    status: Status!
    fixVersion: FixVersion
    assignee: Resource
    reporter: Resource
    comments: [Comment]
  }

  type Comment {
    author: Resource!
    body: String!
  }

  type Status {
    id: ID!
    name: String!
    category: String!
  }

  type FixVersion {
    id: ID!
    name: String!
  }

  type Resource {
    id: ID!
    key: String!
    name: String!
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
    editIssue(issueId: ID!, summary: String): IssueUpdateResponse!

    login(email: String): String # login token
  }

  type IssueUpdateResponse {
    success: Boolean!
    message: String
    issue: Issue
  }
`;

module.exports = typeDefs;
