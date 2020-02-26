import React from "react"
import { navigate } from "gatsby"
import { useQuery, gql } from "@apollo/client"
export const IS_AUTHENTICATED = gql`
  {
    isAuthenticated @client
  }
`
const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const { data } = useQuery(IS_AUTHENTICATED)
  // const { data } = useQuery(IS_LOGGED_IN, {
  //   fetchPolicy: "no-cache",
  // })
  if (!data.isAuthenticated && location.pathname !== `/app/login`) {
    navigate("/app/login")
    return null
  }
  return <Component {...rest} />
}
export default PrivateRoute
