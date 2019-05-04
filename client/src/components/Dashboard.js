import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import Loading from './Loading'
import Error from './Error'
import BarChart from './BarChart'
import { GET_FILTERS } from './Filters'

/**
 * TODO: Use query fragments and merge with Issues component
 */
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

export default function Dashboard() {
  const {
    data: { version, team },
  } = useQuery(GET_FILTERS)

  /**
   * TODO: Fix page crash on reload, version is undefined
   */
  console.log(version)

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
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BarChart
          {...issues}
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
      )}
    </>
  )
}
