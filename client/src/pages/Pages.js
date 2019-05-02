import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { ContentWrapper, PageTitle, Filters } from '../components'

const Pages = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(projectHomeView.id)
  }, [navigationViewController])

  return (
    <ContentWrapper>
      <PageTitle>Pages</PageTitle>
      <Filters />
      <p>This is the pages page.</p>
    </ContentWrapper>
  )
}
export default withNavigationViewController(Pages)
