import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { ProjectHomeView, Page, Header } from '../components'

const Releases = props => {
  useEffect(() => {
    props.navigationViewController.setView(ProjectHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <Header title="Releases" {...props} />
      <p>This is the releases page.</p>
    </Page>
  )
}
export default withNavigationViewController(Releases)
