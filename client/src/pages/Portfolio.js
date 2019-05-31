import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { ProjectHomeView, Page, Header, GanttChart } from '../components'

const Portfolio = props => {
  useEffect(() => {
    props.navigationViewController.setView(ProjectHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <Header title="Portfolio" {...props} />
      <GanttChart />
    </Page>
  )
}
export default withNavigationViewController(Portfolio)
