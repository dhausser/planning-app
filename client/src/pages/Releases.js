import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page, Header } from '../components'

const Releases = props => {
  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <Header title="Releases" {...props} />
      <p>This is the releases page.</p>
    </Page>
  )
}
export default withNavigationViewController(Releases)
