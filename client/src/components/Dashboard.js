import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Grid, GridColumn } from '@atlaskit/page'
import Loading from './Loading'
import Error from './Error'
import BarChart from './BarChart'
import { GET_DASHBOARD_ISSUES, GET_FILTERS, GET_TEAMS } from './queries'

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

const filterByTeam = (issues, team) =>
  team
    ? aggregateByAssignee(
        issues.filter(({ assignee }) => assignee.team === team.id),
      )
    : aggregateByTeam(issues)

export default function Dashboard() {
  const {
    data: { version, team },
  } = useQuery(GET_FILTERS)

  const {
    data: { teams },
  } = useQuery(GET_TEAMS)

  let jql = `statusCategory in (new, indeterminate)${
    version ? ` AND fixVersion=${version.id}` : ''
  }
  `

  if (team && teams) {
    const { members } = teams.find(({ _id }) => _id === team.id)
    jql = `
      ${jql}${
      team && teams ? ` AND assignee in (${members.map(({ key }) => key)})` : ''
    }
    `
  }

  const {
    data: { issues },
    loading,
    error,
  } = useQuery(GET_DASHBOARD_ISSUES, {
    variables: {
      jql,
      pageSize: 3600,
    },
  })

  if (error) return <Error error={error} />
  return (
    <>
      <Grid>
        <GridColumn>
          {loading ? (
            <Loading />
          ) : (
            <BarChart {...issues} dataset={filterByTeam(issues.issues, team)} />
          )}
        </GridColumn>
      </Grid>
    </>
  )
}