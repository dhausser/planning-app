import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productHomeView } from '../components/Nav'
import { Page, Header } from '../components'

const Projects = props => {
  useEffect(() => {
    props.navigationViewController.setView(productHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <Header title="Projects" {...props} />
      <p>This is the Projects page.</p>
    </Page>
  )
}
export default withNavigationViewController(Projects)
