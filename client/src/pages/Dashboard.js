import React, { useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { Grid } from '@atlaskit/page'
import PageHeader from '@atlaskit/page-header'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import TextField from '@atlaskit/textfield'
import EmptyState from '@atlaskit/empty-state'
import {
  ProjectHomeView, Layout, ProjectFilter, VersionFilter, TeamFilter, BarChart, Loading,
} from '../components'

const GET_ISSUES = gql`
  query GetDashboardIssues($projectId: String, $versionId: String, $teamId: String, $startAt: Int, $maxResults: Int) {
    projectId @client @export(as: "projectId")
    versionId @client @export(as: "versionId")
    teamId @client @export(as: "teamId")
    dashboardIssues(projectId: $projectId, versionId: $versionId, teamId: $teamId, startAt: $startAt, maxResults: $maxResults) {
      maxResults
      total
      labels
      values
    }
  }
`

const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flexBasis: 150, marginRight: 8 }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <ProjectFilter />
    <VersionFilter />
    <TeamFilter />
  </div>
)

function Dashboard({ navigationViewController }) {
  useEffect(() => navigationViewController.setView(ProjectHomeView.id), [navigationViewController])
  const { error, loading, data } = useQuery(GET_ISSUES)

  if (error) {
    console.log(error)
    return <EmptyState header={error.name} description={error.message} />
  }

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>Dashboard</PageHeader>
      {loading
        ? <Loading />
        : (
          <div style={{ display: 'block' }}>
            <Grid>
              {data.dashboardIssues
                && data.dashboardIssues
                && (
                  <BarChart
                    labels={data.dashboardIssues.labels}
                    values={data.dashboardIssues.values}
                    maxResults={data.dashboardIssues.maxResults}
                    total={data.dashboardIssues.total}
                  />
                )}
            </Grid>
          </div>
        )}
    </Layout>
  )
}

Dashboard.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
}

export default withNavigationViewController(Dashboard)
