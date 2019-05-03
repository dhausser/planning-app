import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page, Filters } from '../components'

const Components = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(projectHomeView.id)
  }, [navigationViewController])

  return (
    <Page title="Components">
      <Filters />
      <p>This is the active components page.</p>
    </Page>
  )
}
export default withNavigationViewController(Components)
