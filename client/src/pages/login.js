import React from "react"
import { gql, useApolloClient, useMutation } from "@apollo/client"
import Login from "./login"

const LOGIN_USER = gql`
  mutation login {
    login
  }
`

/** TODO: Check that this is actually working */
export default () => {
  const client = useApolloClient()
  const [login] = useMutation(LOGIN_USER, {
    onCompleted: ({ login: token }) => {
      localStorage.setItem("token", token)
      client.writeData({ data: { isAuthenticated: true } })
      window.opener.location.reload()
      window.close()
    },
  })
  // login()
  // return <Login path="/login" />
  return <p>This is the login page</p>
}
