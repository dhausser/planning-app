import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Grid, GridColumn } from '@atlaskit/page'
import Loading from './Loading'
import Error from './Error'
import BarChart from './BarChart'
import { GET_DASHBOARD_ISSUES, GET_FILTERS, GET_TEAMS } from './queries'

export default props => {
  const { data, loading, error } = useQuery(GET_FILTERS)

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return <Teams {...props} filters={data} />
}

const Teams = props => {
  const { data, loading, error } = useQuery(GET_TEAMS, {
    fetchPolicy: 'cache-first',
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return <Dashboard {...props} teams={data.teams} />
}

const Dashboard = ({ filters, teams }) => {
  const { project, version, team } = filters

  const assignee =
    team && teams
      ? teams.find(({ _id }) => _id === team.id).members.map(({ key }) => key)
      : null

  const jql = `${project ? `project=${project.id} and` : ''}\
    ${version ? `fixVersion in (${version.id}) and` : ''}\
    ${assignee ? `assignee in (${assignee}) and` : ''}\
    statusCategory in (new, indeterminate)\
    order by priority desc`

  const { data, loading, error } = useQuery(GET_DASHBOARD_ISSUES, {
    variables: {
      jql,
      maxResults: 1500,
    },
    fetchPolicy: 'network-only',
  })

  if (error) return <Error error={error} />

  return (
    <>
      <Grid>
        <GridColumn>
          {loading ? (
            <Loading />
          ) : (
            <BarChart
              {...data.issues}
              dataset={filterByTeam(data.issues.issues, team)}
            />
          )}
        </GridColumn>
      </Grid>
    </>
  )
}

function aggregateByAssignee(issues) {
  if (!issues) return []

  console.log(issues.length)

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

  console.log(issues.length)

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

function filterByTeam(issues, team) {
  return team
    ? aggregateByAssignee(
        issues.filter(({ assignee }) => assignee.team === team.id),
      )
    : aggregateByTeam(issues)
}
