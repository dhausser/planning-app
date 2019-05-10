import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productIssuesView } from '../components/Nav'
import { Issues, Page, Header } from '../components'

function IssuesPage(props) {
  useEffect(() => {
    props.navigationViewController.setView(productIssuesView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <Header title="Issues" {...props} />
      <Issues pageSize={20} {...props} />
    </Page>
  )
}
export default withNavigationViewController(IssuesPage)
