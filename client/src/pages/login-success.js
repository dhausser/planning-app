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
    onCompleted: ({ login }) => {
      localStorage.setItem("token", login)
      client.writeData({ data: { isAuthenticated: true } })
      window.opener.location.reload()
      window.close()
    },
  })

  if (loading) return <Loading />
  if (error) return <Error header={error.name} description={error.message} />
  
  useEffect(() => {
    login();
  }, [login])

  return (
    <p>Logged in successfully</p>
  )
}

