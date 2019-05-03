import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page } from '../components'

const Releases = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(projectHomeView.id)
  }, [navigationViewController])

  return (
    <Page title="Releases">
      <p>This is the releases page.</p>
    </Page>
  )
}
export default withNavigationViewController(Releases)
