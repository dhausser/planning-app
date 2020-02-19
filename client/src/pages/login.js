import React from "react"
import { useApolloClient, useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
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
      client.writeData({ data: { isLoggedIn: true } })
      window.opener.location.reload()
      window.close()
    },
  })
  login()
  return <Login path="/login" />
}
