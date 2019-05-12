import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import {
  LayoutManagerWithViewController,
  NavigationProvider,
  withNavigationViewController,
} from '@atlaskit/navigation-next'

import {
  MyGlobalNavigation,
  productHomeView,
  productIssuesView,
  projectHomeView,
} from '../components/Nav'

import {
  Dashboard,
  Roadmap,
  Backlog,
  Sprints,
  Reports,
  Releases,
  Pages,
  Components,
  Resource,
  Resources,
  Issue,
  Issues,
  Absences,
  Portfolio,
} from '.'

const App = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.addView(productHomeView)
    navigationViewController.addView(productIssuesView)
    navigationViewController.addView(projectHomeView)
  }, [navigationViewController])

  return (
    <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
      <Switch>
        <Route path="/sprints" component={Sprints} />
        <Route path="/reports" component={Reports} />
        <Route path="/releases" component={Releases} />
        <Route path="/pages" component={Pages} />
        <Route path="/components" component={Components} />
        <Route path="/resources" component={Resources} />
        <Route path="/resource/:resourceId" component={Resource} />
        <Route path="/issues" component={Issues} />
        <Route path="/issue/:issueId" component={Issue} />
        <Route path="/absences" component={Absences} />
        <Route path="/roadmap" component={Roadmap} />
        <Route path="/issues" component={Issues} />
        <Route path="/reports" component={Dashboard} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/backlog" component={Backlog} />
        <Route path="/" component={Portfolio} />
      </Switch>
    </LayoutManagerWithViewController>
  )
}
const AppWithNavigationViewController = withNavigationViewController(App)

export default () => (
  <BrowserRouter>
    <NavigationProvider>
      <AppWithNavigationViewController />
    </NavigationProvider>
  </BrowserRouter>
)
