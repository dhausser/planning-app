import React, { Component, useState, useContext, createContext } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'

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

// Routes
import DashboardsRoute from '../routes/DashboardsRoute'
import ProjectBacklogRoute from '../routes/ProjectBacklogRoute'
import IssuesAndFiltersRoute from '../routes/IssuesAndFiltersRoute'

// Pages
import Dashboard from '../pages/Dashboard'
import Roadmap from '../pages/Roadmap'
import Resources from '../pages/Resources'
import Resource from '../pages/Resource'
import Issues from '../pages/Issues'
import Issue from '../pages/Issue'
import Absences from '../pages/Absences'

import { basicAuth, apiKey, defaultFixVersion } from '../credentials'

export const FilterContext = createContext({
  teams: [],
  setTeams: () => {},
  fixVersion: defaultFixVersion,
  setFixVersion: () => {},
  teamFilter: null,
  setTeamFilter: () => {},
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'same-origin',
})

/**
 * TODO: Handle authentication
 */
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token')
  const token = apiKey
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : `Basic ${basicAuth}`,
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

class App extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props
    navigationViewController.addView(productHomeView)
    navigationViewController.addView(productIssuesView)
    navigationViewController.addView(projectHomeView)
  }

  render() {
    return (
      <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
        <Switch>
          <Route path="/projects/my-project" component={ProjectBacklogRoute} />
          <Route path="/issues" component={IssuesAndFiltersRoute} />
          <Route path="/" component={DashboardsRoute} />
        </Switch>
      </LayoutManagerWithViewController>
    )
  }
}
const AppWithNavigationViewController = withNavigationViewController(App)

export default () => {
  const filterContext = useContext(FilterContext)
  const [fixVersion, setFixVersion] = useState(filterContext.fixVersion)
  const [teamFilter, setTeamFilter] = useState(filterContext.teamFilter)
  return (
    <ApolloProvider client={client}>
      <FilterContext.Provider
        value={{
          teamFilter,
          setTeamFilter,
          fixVersion,
          setFixVersion,
        }}
      >
        <HashRouter>
          <NavigationProvider>
            <AppWithNavigationViewController />
          </NavigationProvider>
        </HashRouter>
      </FilterContext.Provider>
    </ApolloProvider>
  )
}

// return (
//   <Page navigation={<AppWithNav />}>
//     <Route exact path="/" component={Dashboard} />
//     <Route path="/roadmap" component={Roadmap} />
//     <Route path="/resources" component={Resources} />
//     <Route path="/resource/:resourceId" component={Resource} />
//     <Route path="/issues" component={Issues} />
//     <Route path="/issue/:issueId" component={Issue} />
//     <Route path="/absences" component={Absences} />
//   </Page>
// )

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
