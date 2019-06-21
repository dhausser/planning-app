import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    issues(jql: String, startAt: Int, maxResults: Int): IssueConnection!
    issue(id: ID!): Issue
    versions(id: ID!, startAt: Int, maxResults: Int): [FixVersion]
    projects: [Project]!
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

  type Project {
    id: ID!
    key: String!
    name: String!
    avatarUrls: AvatarUrls
    projectTypeKey: String
  }

  type AvatarUrls {
    large: String
    small: String
    xsmall: String
    medium: String
  }

  type IssueUpdateResponse {
    success: Boolean!
    message: String
    issue: Issue
  }

  type Mutation {
    login: String! # login token
    editIssue(issueId: ID!, summary: String): Int
  }
`
export default typeDefs
