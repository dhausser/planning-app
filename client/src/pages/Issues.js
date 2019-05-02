import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import {
  IssueList,
  Filters,
  ContentWrapper,
  PageTitle,
  Loading,
  Error,
} from '../components'
import { GET_FILTERS } from '../components/Filters'
import { projectId } from '../credentials'

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

export default function Issues(props) {
  const {
    data: { version, team },
  } = useQuery(GET_FILTERS)
  const { data, loading, error } = useQuery(GET_ISSUES, {
    variables: {
      jql: `project = ${projectId} AND fixVersion = ${
        version.id
      } ORDER BY KEY ASC`,
      pageSize: 10,
    },
  })
  if (loading) return <Loading />
  if (error) return <Error />
  return (
    <ContentWrapper>
      <PageTitle>Issues</PageTitle>
      <Filters />
      <IssueList
        issues={
          team
            ? data.issues.issues.filter(
                ({ assignee }) => assignee.team === team,
              )
            : data.issues.issues
        }
        maxResults={data.issues.maxResults}
        total={data.issues.total}
        pathname={props.match.path}
        isLoading={loading}
      />
    </ContentWrapper>
  )
}
