import gql from 'graphql-tag'

const ISSUE_TILE_DATA = gql`
  fragment IssueTile on Issue {
    id
    key
    summary
    type
    priority
    status {
      name
      category
    }
    fixVersions {
      id
      name
    }
    assignee {
      key
      name
      team
    }
  }
`

const ISSUE_PAGINATION = gql`
  fragment IssuePagination on IssueConnection {
    startAt
    maxResults
    total
  }
`

export const GET_ISSUE = gql`
  query GetIssueById($id: ID!) {
    issue(id: $id) {
      ...IssueTile
      description
      reporter {
        key
        name
      }
      comments {
        id
        author {
          key
          name
        }
        body
        created
        updated
      }
    }
  }
  ${ISSUE_TILE_DATA}
`

export const GET_ISSUES = gql`
  query issueList($jql: String, $startAt: Int, $maxResults: Int) {
    issues(jql: $jql, startAt: $startAt, maxResults: $maxResults) {
      ...IssuePagination
      issues {
        ...IssueTile
      }
    }
  }
  ${ISSUE_PAGINATION}
  ${ISSUE_TILE_DATA}
`

export const GET_DASHBOARD_ISSUES = gql`
  query issueList($jql: String, $startAt: Int, $maxResults: Int) {
    issues(jql: $jql, startAt: $startAt, maxResults: $maxResults) {
      ...IssuePagination
      issues {
        fixVersions {
          id
          name
        }
        assignee {
          key
          name
          team
        }
      }
    }
  }
  ${ISSUE_PAGINATION}
`

export const GET_STORIES = gql`
  query issueList($jql: String, $startAt: Int, $maxResults: Int) {
    issues(jql: $jql, startAt: $startAt, maxResults: $maxResults) {
      ...IssuePagination
      issues {
        ...IssueTile
        children {
          ...IssueTile
        }
        parent
      }
    }
  }
  ${ISSUE_PAGINATION}
  ${ISSUE_TILE_DATA}
`

export const GET_RESOURCES = gql`
  query resourceList {
    resources {
      key
      name
      team
    }
  }
`

export const GET_RESOURCE = gql`
  query getResourceById($id: ID!) {
    resource(id: $id) {
      name
    }
  }
`

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      key
      name
      avatarUrls {
        # large
        # xsmall
        small
        # medium
      }
      projectTypeKey
    }
  }
`

export const GET_VERSIONS = gql`
  query GetVersions($id: ID!, $startAt: Int, $maxResults: Int) {
    versions(id: $id, startAt: $startAt, maxResults: $maxResults) {
      id
      name
    }
  }
`

export const GET_TEAMS = gql`
  query GetTeams {
    teams {
      _id
      size
      members {
        key
      }
    }
  }
`

export const GET_FILTERS = gql`
  query GetFilters {
    isLoggedIn @client
    project @client {
      id
      name
    }
    version @client {
      id
      name
    }
    team @client {
      id
      name
    }
  }
`

export const GET_ABSENCES = gql`
  query absenceList($id: ID!) {
    absences(id: $id) {
      key
      date
    }
  }
`

export const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
    }
  }
`

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`
