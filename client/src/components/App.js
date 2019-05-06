import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Query, ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'

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
} from './Nav'

import {
  Dashboard,
  Roadmap,
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
} from '../pages'

import apolloClient from '../lib/withData'
import { IS_LOGGED_IN } from './queries'

const client = apolloClient()

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
        <Route path="/" component={Dashboard} />
      </Switch>
    </LayoutManagerWithViewController>
  )
}
const AppWithNavigationViewController = withNavigationViewController(App)

const AppRouter = () => (
  <BrowserRouter>
    <NavigationProvider>
      <AppWithNavigationViewController />
    </NavigationProvider>
  </BrowserRouter>
)

export default () => (
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Query query={IS_LOGGED_IN}>
        {({ data }) =>
          data.isLoggedIn ? <AppRouter client={client} /> : <AppRouter />
        }
      </Query>
    </ApolloHooksProvider>
  </ApolloProvider>
)
