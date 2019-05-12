import React, { useEffect } from 'react'

import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'

import { Dashboard, Page, Header } from '../components'

function DashboardPage(props) {
  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page title="Dashboard">
      <Header {...props} />
      <Dashboard />
    </Page>
  )
}
export default withNavigationViewController(DashboardPage)
