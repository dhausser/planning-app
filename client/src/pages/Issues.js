import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import ContentWrapper, { Center } from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import IssueList from '../components/IssueList'
import Filters, { GET_FILTERS } from '../components/Filters'
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
  if (loading)
    return (
      <Center>
        <Spinner size="large" />
      </Center>
    )
  if (error) return <EmptyState header="Error" description={error.message} />
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
