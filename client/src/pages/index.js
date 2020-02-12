import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import {
  withNavigationViewController,
  LayoutManagerWithViewController,
} from "@atlaskit/navigation-next"

// Components
import GlobalNavigation from "../components/nav/globalNavigation"
import productHomeView from "../components/nav/productHomeView"
import productIssuesView from "../components/nav/productIssuesView"
import projectHomeView from "../components/nav/projectHomeView"

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
import { LoginForm } from "../components"

// Post CSS
import "@atlaskit/css-reset"

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`

function App({ navigationViewController }) {
  const { data } = useQuery(IS_LOGGED_IN)
  useEffect(() => {
    navigationViewController.addView(productHomeView)
    navigationViewController.addView(productIssuesView)
    navigationViewController.addView(projectHomeView)
  }, [navigationViewController])

  console.log(data)

  return (
    <LayoutManagerWithViewController globalNavigation={GlobalNavigation}>
      {data.isLoggedIn ? (
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
      ) : (
        <>
          <Login path="/login" />
          <LoginForm />
        </>
      )}
    </LayoutManagerWithViewController>
  )
}

App.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
}

export default withNavigationViewController(App)
