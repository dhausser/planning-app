/** TODO: Does this actually exist? */
import { useRouteMatch } from "@reach/router"

import { useApolloClient, useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

const LOGIN_USER = gql`
  mutation login {
    login
  }
`

function Login() {
  useRouteMatch("/login")
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
  return null
}

export default Login
