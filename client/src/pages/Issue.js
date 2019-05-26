import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productIssuesView } from '../components/Nav'
import { Issue, Page } from '../components'

function IssuePage(props) {
  useEffect(() => {
    props.navigationViewController.setView(productIssuesView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <Issue {...props} />
    </Page>
  )
}
export default withNavigationViewController(IssuePage)
