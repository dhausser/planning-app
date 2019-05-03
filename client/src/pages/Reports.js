import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page } from '../components'

const Reports = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(projectHomeView.id)
  }, [navigationViewController])

  return (
    <Page title="Reports">
      <p>This is the reports page.</p>
    </Page>
  )
}
export default withNavigationViewController(Reports)
