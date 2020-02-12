import React, { useEffect } from "react"
import { BrowserRouter as Router, Route } from "@reach/router"
import PropTypes from "prop-types"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import {
  withNavigationViewController,
  LayoutManagerWithViewController,
} from "@atlaskit/navigation-next"
import GlobalNavigation from "../components/Nav/GlobalNavigation"
import productHomeView from "../components/Nav/ProductHomeView"
import productIssuesView from "../components/Nav/ProductIssuesView"
import projectHomeView from "../components/Nav/ProjectHomeView"
import Dashboard from "./Dashboard"
import Resource from "./Resource"
import Resources from "./Resources"
import Roadmap from "./Roadmap"
import Issues from "./Issues"
import Issue from "./Issue"
import Projects from "./Projects"
import Backlog from "./Backlog"
import Releases from "./Releases"
import Board from "./Board"
import Pages from "./Pages"
import AddItem from "./AddItem"
import Settings from "./Settings"
import Login from "./Login"
import { LoginForm } from "../components"

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`

function AppRouter({ navigationViewController }) {
  const { data } = useQuery(IS_LOGGED_IN)
  useEffect(() => {
    navigationViewController.addView(productHomeView)
    navigationViewController.addView(productIssuesView)
    navigationViewController.addView(projectHomeView)
  }, [navigationViewController])

  return (
    <Router>
      <LayoutManagerWithViewController globalNavigation={GlobalNavigation}>
        {data.isLoggedIn ? (
          <>
            <Route path="/resource/:resourceId" component={Resource} />
            <Route path="/issue/:issueId" component={Issue} />
            <Route path="/settings" component={Settings} />
            <Route path="/reports" component={Dashboard} />
            <Route path="/releases" component={Releases} />
            <Route path="/backlog" component={Backlog} />
            <Route path="/board" component={Board} />
            <Route path="/roadmap" component={Roadmap} />
            <Route path="/resources" component={Resources} />
            <Route path="/issues" component={Issues} />
            <Route path="/dashboards" component={Dashboard} />
            <Route path="/pages" component={Pages} />
            <Route path="/AddItem" component={AddItem} />
            <Route path="/" exact component={Projects} />
          </>
        ) : (
          <>
            <Route path="/login" exact component={Login} />
            <LoginForm />
          </>
        )}
      </LayoutManagerWithViewController>
    </Router>
  )
}

AppRouter.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
}

export default withNavigationViewController(AppRouter)
