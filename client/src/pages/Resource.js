import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productHomeView } from '../components/Nav'
import { Resource } from '../components'

function ResourcePage({ navigationViewController, match, location }) {
  useEffect(() => {
    navigationViewController.setView(productHomeView.id)
  }, [navigationViewController])

  return <Resource id={match.params.resourceId} location={location} />
}
export default withNavigationViewController(ResourcePage)
