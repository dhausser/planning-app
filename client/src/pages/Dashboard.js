import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { Grid, GridColumn } from '@atlaskit/page'
import { productHomeView } from '../components/Nav'
import { Page, Header, Loading, Error, BarChart } from '../components'
import { GET_DASHBOARD_ISSUES } from '../queries'

import { useIssues } from './Issues'

function DashboardPage({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(productHomeView.id)
  }, [navigationViewController])

  const [issues, filters] = useIssues(GET_DASHBOARD_ISSUES)
  const { data, loading, error } = issues

  return (
    <Page>
      <Header title="Dashboard" />
      <Grid>
        <GridColumn>
          {loading ? (
            <Loading />
          ) : error ? (
            <Error error={error} />
          ) : (
            <BarChart {...data.issues} team={filters.team} />
          )}
        </GridColumn>
      </Grid>
    </Page>
  )
}
export default withNavigationViewController(DashboardPage)
