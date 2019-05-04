import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page, Header } from '../components'

const Pages = props => {
  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <Header title="Pages" {...props} />
      <p>This is the pages page.</p>
    </Page>
  )
}
export default withNavigationViewController(Pages)
