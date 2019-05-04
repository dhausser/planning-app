import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { Page, Header, Roadmap } from '../components'

function RoadmapPage(props) {
  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page title="Roadmap">
      <p>
        <Link to="/">Back to Dashboards</Link>
      </p>
      <Header {...props} />
      <Roadmap />
    </Page>
  )
}
export default withNavigationViewController(RoadmapPage)
