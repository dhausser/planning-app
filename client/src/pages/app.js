import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout"
import PrivateRoute from "../components/privateRoute"
import Profile from "../components/profile"
import Login from "../components/login"
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

const App = () => (
  <Layout>
    <Router>
      <PrivateRoute Projects path="/app/" component={Projects} />
      <PrivateRoute Dashboard path="/app/dashboards" component={Dashboard} />
      <PrivateRoute Roadmap path="/app/roadmap" component={Roadmap} />
      <PrivateRoute Backlog path="/app/backlog" component={Backlog} />
      <PrivateRoute Board path="/app/board" component={Board} />
      <PrivateRoute Dashboard path="/app/reports" component={Dashboard} />
      <PrivateRoute Releases path="/app/releases" component={Releases} />
      <PrivateRoute Issues path="/app/issues" component={Issues} />
      <PrivateRoute Pages path="/app/pages" component={Pages} />
      <PrivateRoute Resources path="/app/resources" component={Resources} />
      <PrivateRoute Settings path="/app/settings" component={Settings} />
      <PrivateRoute AddItem path="/app/AddItem" component={AddItem} />
      <PrivateRoute Issue path="/app/issue/:issueId" component={Issue} />
      <PrivateRoute
        Resource
        path="/app/resource/:resourceId"
        component={Resource}
      />
      <PrivateRoute path="/app/profile" component={Profile} />
      <Login path="/app/login" />
    </Router>
  </Layout>
)

export default App
