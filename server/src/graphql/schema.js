import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    issues(projectId: String, versionId: String, teamId: String, resourceId: String, startAt: Int, maxResults: Int): IssueConnection!
    dashboardIssues(projectId: String, versionId: String, teamId: String, startAt: Int, maxResults: Int): IssueConnection!
    roadmapIssues(jql: String): [Issue]!
    issue(id: ID!): Issue
    versions(id: ID!, startAt: Int, maxResults: Int): [Version]
    projects: [Project]!
    resources: [Resource]!
    resource(id: ID!): Resource
    teams: [Team]!
    team(id: ID!): Team
    absences(id: ID!, secret: String, versionId: String): [Absence]!
  }

  type Project {
    id: ID!
    key: String!
    name: String!
    avatarUrls: AvatarUrls
    projectTypeKey: String
  }

  type Version {
    id: ID!
    name: String!
    description: String
  }

  type Team {
    id: ID!
    name: String!
    members: [Resource]!
  }

  type Issue {
    id: ID!
    key: String!
    summary: String!
    priority: String!
    type: String!
    description: String
    status: Status!
    fixVersions: [Version]
    assignee: Resource
    reporter: Resource
    comments: [Comment]
    children: [Issue]
    parent: String
  }

  type IssueConnection {
    startAt: Int!
    maxResults: Int!
    total: Int!
    issues: [Issue]!
  }

  type IssueUpdateResponse {
    success: Boolean!
    message: String
    issue: Issue
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

  type Resource {
    key: ID
    name: String
    team: String
  }

  type Absence {
    key: String!
    date: String!
  }

  type AvatarUrls {
    large: String
    small: String
    xsmall: String
    medium: String
  }

  type User {
    id: ID!
    email: String!
    team: Team
    issues: [Issue]
    absences: [Absence]
  }

  type Mutation {
    # Edit Jira Issues
    editIssue(issueId: ID!, summary: String): Int

    # Return Access Token
    loginUser: String!
  }
`;

export default typeDefs;
