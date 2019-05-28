import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { Grid, GridColumn } from '@atlaskit/page'
import { productHomeView } from '../components/Nav'
import { Page, Header, Loading, Error, BarChart } from '../components'
import { GET_FILTERS, GET_RESOURCES, GET_DASHBOARD_ISSUES } from '../queries'

import { jqlParser } from './Issues'

function DashboardPage({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(productHomeView.id)
  }, [navigationViewController])

  const { data: filters } = useQuery(GET_FILTERS)
  const { data: resources } = useQuery(GET_RESOURCES)
  const assignee =
    resources.length &&
    resources.filter(resource => resource.team === filters.team)
  const jql = jqlParser(filters, assignee)

  const { data, loading, error } = useQuery(GET_DASHBOARD_ISSUES, {
    variables: {
      jql,
      maxResults: 50,
    },
    fetchPolicy: 'cache-first',
  })

  if (error) return <Error error={error} />

  return (
    <Page>
      <Header title="Dashboard" />
      <Grid>
        <GridColumn>
          {loading ? (
            <Loading />
          ) : (
            <BarChart
              {...data.issues}
              dataset={filterByTeam(data.issues.issues, filters.team)}
            />
          )}
        </GridColumn>
      </Grid>
    </Page>
  )
}
export default withNavigationViewController(DashboardPage)

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

function filterByTeam(issues, team) {
  return team
    ? aggregateByAssignee(
        issues.filter(({ assignee }) => assignee.team === team.id),
      )
    : aggregateByTeam(issues)
}
