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
  Portfolio,
  Roadmap,
  Backlog,
  Resource,
  Resources,
  Issue,
  Issues,
  Reports,
  Releases,
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
        <Route path="/reports" component={Reports} />
        <Route path="/releases" component={Releases} />
        <Route path="/resources" component={Resources} />
        <Route path="/resource/:resourceId" component={Resource} />
        <Route path="/issues/:filterId" component={Issues} />
        <Route path="/issue/:issueId" component={Issue} />
        <Route path="/roadmap" component={Roadmap} />
        <Route path="/issues" component={Issues} />
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
