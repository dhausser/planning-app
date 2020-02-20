import "@atlaskit/css-reset"

import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { gql, useQuery } from "@apollo/client"
import {
  withNavigationViewController,
  LayoutManagerWithViewController,
} from "@atlaskit/navigation-next"

// Pages
import Dashboard from "./dashboard"
import Resource from "./resource"
import Resources from "./resources"
import Roadmap from "./roadmap"
import Issues from "./issues"
import Issue from "./issue"
import Projects from "./projects"
import Backlog from "./backlog"
import Releases from "./releases"
import Board from "./board"
import Pages from "./pages"
import AddItem from "./addItem"
import Settings from "./settings"
import Login from "./login"
import {
  GlobalNavigation,
  productHomeView,
  productIssuesView,
  projectHomeView,
} from "../components"

export const IS_LOGGED_IN = gql`
  {
    isAuthenticated @client
  }
`

const PrivateRoutes = () => (
  <>
    <Projects path="/" />
    <Dashboard path="/dashboards" />
    <Roadmap path="/roadmap" />
    <Backlog path="/backlog" />
    <Board path="/board" />
    <Dashboard path="/reports" />
    <Releases path="/releases" />
    <Issues path="/issues" />
    <Pages path="/pages" />
    <Resources path="/resources" />
    <Settings path="/settings" />
    <AddItem path="/AddItem" />
    <Issue path="/issue/:issueId" />
    <Resource path="/resource/:resourceId" />
  </>
)

function App({ navigationViewController }) {
  const { data: { isAuthenticated } } = useQuery(IS_LOGGED_IN)

  useEffect(() => {
    navigationViewController.addView(productHomeView)
    navigationViewController.addView(productIssuesView)
    navigationViewController.addView(projectHomeView)
  }, [navigationViewController])

  return (
    <LayoutManagerWithViewController globalNavigation={GlobalNavigation}>
      {isAuthenticated ? (
        <PrivateRoutes />
      ) : (
          <>
            <Login />
          </>
        )}
    </LayoutManagerWithViewController>
  )
}

App.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
}

export default withNavigationViewController(App)
