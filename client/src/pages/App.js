import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import {
  LayoutManagerWithViewController,
  NavigationProvider,
  withNavigationViewController,
} from '@atlaskit/navigation-next'

import {
  GlobalNavigation,
  ProductHomeView,
  ProductIssuesView,
  ProjectHomeView,
} from '../components'

import {
  Dashboard,
  Portfolio,
  Roadmap,
  Backlog,
  Resource,
  Resources,
  Issue,
  Issues,
  Reports,
  Releases,
  Settings,
  Projects,
} from '.'

const App = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.addView(ProductHomeView)
    navigationViewController.addView(ProductIssuesView)
    navigationViewController.addView(ProjectHomeView)
  }, [navigationViewController])

  return (
    <Router>
      <LayoutManagerWithViewController globalNavigation={GlobalNavigation}>
        <Switch>
          <Route path="/projects" component={Projects} />
          <Route path="/dashboards" component={Dashboard} />
          <Route path="/reports" component={Reports} />
          <Route path="/issues" component={Issues} />
          <Route path="/settings" component={Settings} />
          <Route path="/releases" component={Releases} />
          <Route path="/resources" component={Resources} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/backlog" component={Backlog} />
          <Route path="/resource/:resourceId" component={Resource} />
          <Route path="/issue/:issueId" component={Issue} />
          <Route path="/issues/:filterId" component={Issues} />
        </Switch>
      </LayoutManagerWithViewController>
    </Router>
  )
}
const AppWithNavigationViewController = withNavigationViewController(App)

export default () => (
  <NavigationProvider>
    <AppWithNavigationViewController />
  </NavigationProvider>
)
