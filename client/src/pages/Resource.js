import React, { useEffect } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productHomeView } from '../components/Nav'
import { Resource } from '../components'

function ResourcePage(props) {
  useEffect(() => {
    props.navigationViewController.setView(productHomeView.id)
  }, [props.navigationViewController])

  return <Resource {...props} />
}
export default withNavigationViewController(ResourcePage)
