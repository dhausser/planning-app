import React, { useEffect } from "react"
import { navigate } from "gatsby"
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
    onCompleted: ({ login }) => {
      localStorage.setItem("token", login)
      client.writeData({ data: { isLoggedIn: true } })
      window.opener.location.reload()
      window.close()
      // navigate("/")
      return null
    },
  })
  useEffect(() => {
    login()
  }, [login])
  if (loading) return <Loading />
  if (error) return <Error error={error} />
  return null
}
