import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productHomeView } from '../components/Nav'
import { Page, Header } from '../components'

const Settings = props => {
  useEffect(() => {
    props.navigationViewController.setView(productHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <Header title="Settings" {...props} />
      <p>This is the Settings page.</p>
    </Page>
  )
}
export default withNavigationViewController(Settings)
