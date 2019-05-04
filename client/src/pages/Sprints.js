import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page, Header } from '../components'

const Sprints = props => {
  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <Header title="Active sprints" {...props} />
      <p>This is the active sprints page.</p>
    </Page>
  )
}
export default withNavigationViewController(Sprints)
