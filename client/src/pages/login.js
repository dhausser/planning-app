import React, { useEffect } from "react"
import { gql, useApolloClient, useMutation } from "@apollo/client"
import { Loading, Error } from "../components"

const LOGIN_USER = gql`
  mutation login {
    login
  }
`

export default () => {
  const client = useApolloClient()
  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onError: error => {
      console.log("Mutation error occured while trying to log in:\n", error)
    },
    onCompleted: ({ login: token }) => {
      console.log("Login mutation completed with token value:", token)
      localStorage.setItem("token", token)
      client.writeData({ data: { isLoggedIn: true } })
      window.opener.location.reload()
      window.close()
    },
  })
  useEffect(() => {
    login()
  }, [login])
  if (loading) return <Loading />
  if (error) return <Error error={error} />
  return null
}
