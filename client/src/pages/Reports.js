import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { ProjectHomeView, Page, Header } from '../components'

const Reports = props => {
  useEffect(() => {
    props.navigationViewController.setView(ProjectHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <Header title="Reports" {...props} />
      <p>This is the Reports page.</p>
    </Page>
  )
}
export default withNavigationViewController(Reports)
