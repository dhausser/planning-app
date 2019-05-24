import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page, Header, Epic } from '../components'

function RoadmapPage(props) {
  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page title="Roadmap">
      <Header {...props} />
      <Epic />
    </Page>
  )
}
export default withNavigationViewController(RoadmapPage)
