import React, { useEffect } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Query, ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import gql from 'graphql-tag'
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

const client = apolloClient()

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`

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
  <HashRouter>
    <NavigationProvider>
      <AppWithNavigationViewController />
    </NavigationProvider>
  </HashRouter>
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
