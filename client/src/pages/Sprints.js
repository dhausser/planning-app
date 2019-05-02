import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { ContentWrapper, PageTitle, Filters } from '../components'

const Sprints = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(projectHomeView.id)
  }, [navigationViewController])

  return (
    <ContentWrapper>
      <PageTitle>Active sprints</PageTitle>
      <Filters />
      <p>This is the active sprints page.</p>
    </ContentWrapper>
  )
}
export default withNavigationViewController(Sprints)
