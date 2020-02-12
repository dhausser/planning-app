import React from "react"
import { ApolloProvider } from "@apollo/react-hooks"
import { NavigationProvider } from "@atlaskit/navigation-next"
import client from "./client"

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <NavigationProvider>{element}</NavigationProvider>
  </ApolloProvider>
)
