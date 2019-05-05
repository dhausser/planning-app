import React from 'react'
import { useQuery } from 'react-apollo-hooks'

import Loading from './Loading'
import Error from './Error'
import BarChart from './BarChart'
import { GET_DASHBOARD_ISSUES, GET_FILTERS } from './queries'

export default function Dashboard() {
  const {
    data: { version, team },
  } = useQuery(GET_FILTERS)

  const jql = `fixVersion = ${
    version.id
  } AND statusCategory in (new, indeterminate)`

  const {
    data: { issues },
    loading,
    error,
  } = useQuery(GET_DASHBOARD_ISSUES, {
    variables: {
      jql,
      pageSize: 1250,
    },
  })

  if (error) return <Error error={error} />
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BarChart {...issues} dataset={filterByTeam(issues.issues, team)} />
      )}
    </>
  )
}

const filterByTeam = (issues, team) =>
  team
    ? aggregateByAssignee(
        issues.filter(({ assignee }) => assignee.team === team),
      )
    : aggregateByTeam(issues)

const aggregateByAssignee = issues => {
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

const aggregateByTeam = issues => {
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
