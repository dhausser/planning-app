import React from "react"
import { useQuery, gql } from "@apollo/client"
import { Layout, LoginForm } from "../components"
import Projects from "./projects"

export const IS_LOGGED_IN = gql`
  {
    isAuthenticated @client
  }
`

export default () => {
  const { data } = useQuery(IS_LOGGED_IN)
  return (
    <Layout>
      {data && data.isAuthenticated ? <Projects /> : <LoginForm />}
    </Layout>
  )
}
