import React, { useEffect } from "react"
import { useQuery } from "@apollo/client"
import { withNavigationViewController } from "@atlaskit/navigation-next"
import { productHomeView } from "../components"
import { IS_AUTHENTICATED } from "../components/privateRoute"

function Default({ navigationViewController }) {
  const { data } = useQuery(IS_AUTHENTICATED)
  useEffect(() => navigationViewController.setView(productHomeView.id), [
    navigationViewController,
  ])
  return <p>Is the user authenticated: {`${data && data.isAuthenticated}`}</p>
}

export default withNavigationViewController(Default)
