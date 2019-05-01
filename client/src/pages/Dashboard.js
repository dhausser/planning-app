import React, { Fragment } from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Spinner from '@atlaskit/spinner'
import EmptyState from '@atlaskit/empty-state'
import ContentWrapper, { Center } from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import BarChart from '../components/BarChart'
import Filters, { GET_FILTERS } from '../components/Filters'

const GET_ISSUES = gql`
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

export default () => {
  const {
    data: { version, team },
  } = useQuery(GET_FILTERS)
  const {
    data: { issues },
    loading,
    error,
  } = useQuery(GET_ISSUES, {
    variables: {
      jql: `fixVersion = ${
        version.id
      } AND statusCategory in (new, indeterminate)`,
      pageSize: 1250,
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
      <PageTitle>Dashboard</PageTitle>
      <Filters />
      <Fragment>
        <h5>
          Displaying{' '}
          {issues.maxResults > issues.total ? issues.total : issues.maxResults}{' '}
          of {issues.total} issues in fixVersion
        </h5>
        <BarChart
          dataset={
            team
              ? aggregateByAssignee(
                  issues.issues.filter(
                    ({ assignee }) => assignee.team === team,
                  ),
                )
              : aggregateByTeam(issues.issues)
          }
        />
      </Fragment>
    </ContentWrapper>
  )
}

function aggregateByAssignee(issues) {
  if (!issues) return []

  return issues.reduce((resources, issue) => {
    if (issue.assignee && issue.assignee.name) {
      const name = issue.assignee.name.split(' ').shift()
      if (!resources[name]) {
        resources[name] = 0
      }
      resources[name] += 1
    }
    return resources
  }, {})
}

function aggregateByTeam(issues) {
  if (!issues) return []

  return issues.reduce((teams, issue) => {
    if (issue.assignee && issue.assignee.team) {
      const { team: teamName } = issue.assignee
      if (!teams[teamName]) {
        teams[teamName] = 0
      }
      teams[teamName] += 1
    }
    return teams
  }, {})
}
