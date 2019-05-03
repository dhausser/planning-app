import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page, Filters } from '../components'

const Reports = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(projectHomeView.id)
  }, [navigationViewController])

  return (
    <Page title="Reports">
      <Filters />
      <p>This is the reports page.</p>
    </Page>
  )
}
export default withNavigationViewController(Reports)
