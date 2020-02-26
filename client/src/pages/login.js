import React, { useEffect } from "react"
import { withNavigationViewController } from "@atlaskit/navigation-next"
import { productHomeView, LoginForm } from "../components"

function Login({ navigationViewController }) {
  useEffect(() => navigationViewController.setView(productHomeView.id), [
    navigationViewController,
  ])
  return <LoginForm />
}

export default withNavigationViewController(Login)
