import React, { Fragment, useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productHomeView } from '../components/Nav'

import {
  BarChart,
  ContentWrapper,
  PageTitle,
  Filters,
  Loading,
  Error,
} from '../components'
import { GET_FILTERS } from '../components/Filters'

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

const Dashboard = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(productHomeView.id)
  }, [navigationViewController])

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

  if (error) return <Error error={error} />

  let dataset = []
  if (!loading)
    dataset = team
      ? aggregateByAssignee(
          issues.issues.filter(({ assignee }) => assignee.team === team),
        )
      : aggregateByTeam(issues.issues)

  return (
    <ContentWrapper>
      <PageTitle>Dashboard</PageTitle>
      <Filters />
      <Fragment>
        {loading ? (
          <Loading />
        ) : (
          <BarChart
            dataset={dataset}
            maxResult={issues.maxResult}
            total={issues.total}
          />
        )}
      </Fragment>
    </ContentWrapper>
  )
}
export default withNavigationViewController(Dashboard)
