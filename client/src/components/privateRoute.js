import React from "react"
import { navigate } from "gatsby"
import { useQuery } from "@apollo/client"
import { IS_LOGGED_IN } from "../pages"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const { data } = useQuery(IS_LOGGED_IN)
  if (!data.isAuthenticated() && location.pathname !== `/app/login`) {
    navigate("/app/login")
    return null
  }

  return <Component {...rest} />
}

export default PrivateRoute
