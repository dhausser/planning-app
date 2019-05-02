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

// Pages
import {
  Dashboard,
  Roadmap,
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
        <Route path="/roadmap" component={Roadmap} />
        <Route path="/resources" component={Resources} />
        <Route path="/resource/:resourceId" component={Resource} />
        <Route path="/issues" component={Issues} />
        <Route path="/issue/:issueId" component={Issue} />
        <Route path="/absences" component={Absences} />
        <Route path="/projects/my-project" component={Roadmap} />
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

/**
 * Hook App
 */
// const App = ({ navigationViewController }) => {
//   const filterContext = useContext(FilterContext)
//   const [fixVersion, setFixVersion] = useState(filterContext.fixVersion)
//   const [teamFilter, setTeamFilter] = useState(filterContext.teamFilter)

//   useEffect(() => {
//     navigationViewController.addView(productHomeView)
//     navigationViewController.addView(productIssuesView)
//     navigationViewController.addView(projectHomeView)
//   })

//   return (
//     <FilterContext.Provider
//       value={{
//         teamFilter,
//         setTeamFilter,
//         fixVersion,
//         setFixVersion,
//       }}
//     >
//       <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
//         <Switch>
//           <Route path="/projects/my-project" component={ProjectBacklogRoute} />
//           <Route path="/issues" component={IssuesAndFiltersRoute} />
//           <Route path="/" component={DashboardsRoute} />
//         </Switch>
//       </LayoutManagerWithViewController>
//     </FilterContext.Provider>
//   )
// }
// const AppWithNavigationViewController = withNavigationViewController(App)
