import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page, Header } from '../components'

const Portfolio = props => {
  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <Header title="Portfolio" {...props} />
      <p>This is the Portfolio page.</p>
    </Page>
  )
}
export default withNavigationViewController(Portfolio)
