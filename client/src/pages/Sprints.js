import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page } from '../components'

const Sprints = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(projectHomeView.id)
  }, [navigationViewController])

  return (
    <Page title="Active sprints">
      <p>This is the active sprints page.</p>
    </Page>
  )
}
export default withNavigationViewController(Sprints)
