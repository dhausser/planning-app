import gql from 'graphql-tag'

export const GET_ISSUE = gql`
  query GetIssueById($id: ID!) {
    issue(id: $id) {
      id
      key
      summary
      priority
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
