import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page, Filters } from '../components'

const Pages = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(projectHomeView.id)
  }, [navigationViewController])

  return (
    <Page title="Pages">
      <Filters />
      <p>This is the pages page.</p>
    </Page>
  )
}
export default withNavigationViewController(Pages)
