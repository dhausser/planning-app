import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout"
import Projects from "./projects"
import Dashboard from "./dashboard"
import Resource from "./resource"
import Resources from "./resources"
import Roadmap from "./roadmap"
import Issues from "./issues"
import Issue from "./issue"
import Backlog from "./backlog"
import Releases from "./releases"
import Board from "./board"
import Pages from "./pages"
import AddItem from "./addItem"
import Settings from "./settings"
import Login from "./login"
import Default from "./default"
import PrivateRoute from "../components/privateRoute"

export default () => (
  <Layout>
    <Router basePath="/app">
      <PrivateRoute path="/projects" component={Projects} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <PrivateRoute path="/roadmap" component={Roadmap} />
      <PrivateRoute path="/backlog" component={Backlog} />
      <PrivateRoute path="/board" component={Board} />
      <PrivateRoute path="/reports" component={Dashboard} />
      <PrivateRoute path="/releases" component={Releases} />
      <PrivateRoute path="/issues" component={Issues} />
      <PrivateRoute path="/pages" component={Pages} />
      <PrivateRoute path="/resources" component={Resources} />
      <PrivateRoute path="/settings" component={Settings} />
      <PrivateRoute path="/additem" component={AddItem} />
      <PrivateRoute path="/issue/:issueId" component={Issue} />
      <PrivateRoute path="/resource/:resourceId" component={Resource} />
      <Login path="/login" />
      <Default path="/" />
    </Router>
  </Layout>
)
