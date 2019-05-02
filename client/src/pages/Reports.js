import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import { ContentWrapper, PageTitle, Filters } from '../components'

const Reports = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(projectHomeView.id)
  }, [navigationViewController])

  return (
    <ContentWrapper>
      <PageTitle>Reports</PageTitle>
      <Filters />
      <p>This is the reports page.</p>
    </ContentWrapper>
  )
}
export default withNavigationViewController(Reports)
