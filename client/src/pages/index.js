import React from "react"
import { Link } from "gatsby"
import { useQuery, gql } from "@apollo/client"
import { getUser, isLoggedIn } from "../services/auth"
import { Layout, LoginForm } from "../components"

const IS_LOGGED_IN = gql`
  {
    isAuthenticated @client
  }
`

export default () => {
  const { data } = useQuery(IS_LOGGED_IN)
  return (
    <Layout>
      <h1>Hello {isLoggedIn() ? getUser().name : "world"}!</h1>
      <p>
        {/* {data.isAuthenticated ? ( */}
        {data.isAuthenticated ? (
          <>
            You are logged in, so check your{" "}
            <Link to="/app/profile">profile</Link>
          </>
        ) : (
          <>
            You should <Link to="/app/login">log in</Link> to see restricted
            content
            <LoginForm />
          </>
        )}
      </p>
    </Layout>
  )
}
