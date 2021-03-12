import { gql } from "@apollo/client";

export const typeDefs = gql`
  type Query {
    issues(
      projectId: String
      issuetypeId: String
      versionId: String
      statusId: String
      teamId: String
      resourceId: String
      startAt: Int
      maxResults: Int
    ): IssueConnection!
    dashboardIssues(
      projectId: String
      versionId: String
      teamId: String
      startAt: Int
      maxResults: Int
    ): DashboardIssueConnection!
    roadmapIssues(projectId: String, versionId: String): [Issue]!
    epics(projectId: String, versionId: String): [Issue]!
    issue(id: ID!): Issue
    projects: [Project]!
    versions(id: ID!): [Version]
    statuses(id: ID!): [Status]
    resources(offset: Int, limit: Int, teamId: String): [Resource]!
    resource(id: ID!): Resource
    teams: [Team]!
    team(id: ID!): Team
    absences(id: ID!, versionId: String): [Absence]!
    user(id: ID!): User!
    myself: User!
    assignableUsers(
      username: String
      project: String
      issueKey: String
      startAt: Int
      maxResults: Int
      actionDescriptorId: Int
    ): [User]!
    loginToken: String
    currentUser: String
    authToken: String
  }

  type User {
    key: String!
    accountId: String!
    name: String!
    emailAddress: String!
    avatarUrls: AvatarUrls!
    displayName: String!
    active: Boolean!
    timeZone: String!
    groups: Groups
  }

  type Groups {
    size: Int!
    items: [Group]!
  }

  type Group {
    name: String!
    self: String!
  }

  type Issue {
    id: ID!
    key: String!
    fields: Fields
    children: [Issue]
  }

  type Fields {
    summary: String!
    status: Status!
    issuetype: Issuetype!
    priority: Priority!
    fixVersions: [Version]
    assignee: Resource
    description: String
    reporter: Resource
    comment: CommentConnection
  }

  type Priority {
    id: String
    name: String
  }

  type Status {
    id: ID!
    name: String!
    statusCategory: StatusCategory!
  }

  type Issuetype {
    id: ID!
    name: String!
    description: String!
    iconUrl: String!
    subtask: Boolean!
    avatarId: Int!
  }

  type StatusCategory {
    id: ID!
    key: String!
    name: String!
    colorName: String!
  }

  type CommentConnection {
    comments: [Comment]!
    maxResults: Int!
    total: Int!
    startAt: Int!
  }

  type Comment {
    id: ID!
    author: Resource!
    body: String!
    created: String!
    updated: String
  }

  type IssueConnection {
    startAt: Int!
    maxResults: Int!
    total: Int!
    issues: [Issue]!
  }

  type DashboardIssueConnection {
    startAt: Int!
    maxResults: Int!
    total: Int!
    labels: [String]
    values: [Int]
  }

  type IssueUpdateResponse {
    success: Boolean!
    message: String
    issue: Issue
  }

  type Resource {
    key: ID!
    name: String!
    email: String!
    employeeId: String
    position: String
    team: Team
    teamId: Int
    phone: String
    displayName: String
    avatarUrls: AvatarUrls
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
    key: String!
    name: String!
    type: String!
    members: [Resource]!
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

  type UserSession {
    token: String!
  }

  type Mutation {
    # Edit Jira Issues
    editIssue(id: ID!, value: String!, type: String!): String
    assignIssue(id: ID!, key: String): String

    # Return Access Token
    login: String!
    signin: UserSession
    signout: String

    # Resources
    createResource(
      firstname: String!
      lastname: String!
      position: String!
      team: String!
    ): Resource
    updateResource(
      id: ID!
      firstname: String!
      lastname: String!
      position: String!
      team: String!
    ): Resource
    deleteResource(id: ID!): Resource
    createAllResources: [Resource]!
    deleteAllResources: Int!
  }
`;
