import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page, Header } from '../components'

const Backlog = props => {
  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <Header title="Backlog" {...props} />
      <p>This is the Backlog page.</p>
    </Page>
  )
}
export default withNavigationViewController(Backlog)
