import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { ContentWrapper, PageTitle, Filters } from '../components'

const Releases = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(projectHomeView.id)
  }, [navigationViewController])

  return (
    <ContentWrapper>
      <PageTitle>Releases</PageTitle>
      <Filters />
      <p>This is the releases page.</p>
    </ContentWrapper>
  )
}
export default withNavigationViewController(Releases)
