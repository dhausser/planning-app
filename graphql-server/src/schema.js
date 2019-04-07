const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    # Queries for Jira issues
    issues: [Issue]!
    issue(id: ID!): Issue
    # Queries for MongoDB Team Resources
    resources: [Resource]!
    resource(id: ID!): Resource
    teams: [Team]!
    team(id: ID!): Team
    # Queries for Portal Absences
    absences: [Absence]!
    absence(id: ID!): Absence
    # Queries for the current user
    me: User
  }

  type Issue {
    id: ID!
    key: String!
    summary: String!
    assignee: String
    reporter: String
    priority: String!
    status: String!
  }

  type Resource {
    id: ID!
    name: String!
    team: Team!
  }

  type Team {
    id: ID!
    name: String!
    resources: [Resource]!
  }

  type Absence {
    id: ID!
    resource: Resource
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
    editIssue(issueId: ID!): IssueUpdateResponse!

    login(email: String): String # login token
  }

  type IssueUpdateResponse {
    success: Boolean!
    message: String
    issues: [Issue]
  }
`;

module.exports = typeDefs;
