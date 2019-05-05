import gql from 'graphql-tag'

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

export const GET_ISSUES = gql`
  query issueList($jql: String, $pageSize: Int!) {
    issues(jql: $jql, pageSize: $pageSize) {
      startAt
      maxResults
      total
      issues {
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
    }
  }
`
export const GET_DASHBOARD_ISSUES = gql`
  query issueList($jql: String, $pageSize: Int!) {
    issues(jql: $jql, pageSize: $pageSize) {
      startAt
      maxResults
      total
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
`

export const GET_EPICS = gql`
  query issueList($jql: String, $pageSize: Int!) {
    issues(jql: $jql, pageSize: $pageSize) {
      startAt
      maxResults
      total
      issues {
        id
        key
        summary
        type
        priority
        status {
          name
          category
        }
      }
    }
  }
`

export const GET_STORIES = gql`
  query issueList($jql: String, $pageSize: Int!) {
    issues(jql: $jql, pageSize: $pageSize) {
      startAt
      maxResults
      total
      issues {
        id
        key
        summary
        type
        priority
        status {
          name
          category
        }
        children {
          key
          summary
          type
          priority
          status {
            name
            category
          }
        }
        parent
      }
    }
  }
`

export const GET_ISSUE = gql`
  query GetIssueById($id: ID!) {
    issue(id: $id) {
      id
      key
      summary
      priority
      type
      status {
        name
        category
      }
      fixVersions {
        name
      }
      assignee {
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

export const GET_VERSIONS = gql`
  query GetVersions($id: ID!, $pageSize: Int, $after: Int) {
    versions(id: $id, pageSize: $pageSize, after: $after) {
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
    version @client {
      id
      name
    }
    team @client
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
