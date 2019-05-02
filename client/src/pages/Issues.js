import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { productIssuesView } from '../components/Nav'
import {
  IssueList,
  Filters,
  ContentWrapper,
  PageTitle,
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

function Issues(props) {
  useEffect(() => {
    props.navigationViewController.setView(productIssuesView.id)
  }, [props.navigationViewController])

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

  if (error) return <Error error={error} />

  let issues = []
  if (!loading)
    issues = team
      ? data.issues.issues.filter(({ assignee }) => assignee.team === team)
      : data.issues.issues

  return (
    <ContentWrapper>
      <PageTitle>Issues</PageTitle>
      <Filters />
      <IssueList
        issues={issues || []}
        maxResults={(data.issues && data.issues.maxResults) || 0}
        total={(data.issues && data.issues.total) || 0}
        pathname={props.match.path}
        isLoading={loading}
      />
    </ContentWrapper>
  )
}
export default withNavigationViewController(Issues)
