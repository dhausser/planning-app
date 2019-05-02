import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { ContentWrapper, PageTitle, Filters } from '../components'

const Components = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(projectHomeView.id)
  }, [navigationViewController])

  return (
    <ContentWrapper>
      <PageTitle>Components</PageTitle>
      <Filters />
      <p>This is the active components page.</p>
    </ContentWrapper>
  )
}
export default withNavigationViewController(Components)
