import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout"
import PrivateRoute from "../components/privateRoute"
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

export default () => (
  <Layout>
    <Router>
      <PrivateRoute Projects path="/" component={Projects} />
      <PrivateRoute Dashboard path="/dashboard" component={Dashboard} />
      <PrivateRoute Roadmap path="/roadmap" component={Roadmap} />
      <PrivateRoute Backlog path="/backlog" component={Backlog} />
      <PrivateRoute Board path="/board" component={Board} />
      <PrivateRoute Dashboard path="/reports" component={Dashboard} />
      <PrivateRoute Releases path="/releases" component={Releases} />
      <PrivateRoute Issues path="/issues" component={Issues} />
      <PrivateRoute Pages path="/pages" component={Pages} />
      <PrivateRoute Resources path="/resources" component={Resources} />
      <PrivateRoute Settings path="/settings" component={Settings} />
      <PrivateRoute AddItem path="/AddItem" component={AddItem} />
      <PrivateRoute Issue path="/issue/:issueId" component={Issue} />
      <PrivateRoute
        Resource
        path="/resource/:resourceId"
        component={Resource}
      />
    </Router>
  </Layout>
)
