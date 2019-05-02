import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import { Query, ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { ApolloClient } from 'apollo-client'
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

// Routes
import DashboardsRoute from '../routes/DashboardsRoute'
import ProjectBacklogRoute from '../routes/ProjectBacklogRoute'
import IssuesAndFiltersRoute from '../routes/IssuesAndFiltersRoute'

// Pages
// import Login from '../pages/Login'
// import Dashboard from '../pages/Dashboard'
import Roadmap from '../pages/Roadmap'
import Resources from '../pages/Resources'
import Resource from '../pages/Resource'
import Issues from '../pages/Issues'
import Issue from '../pages/Issue'
import Absences from '../pages/Absences'
import { resolvers, typeDefs } from '../resolvers'
import { basicAuth, apiKey, defaultFixVersion } from '../credentials'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'same-origin',
})
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

const cache = new InMemoryCache()
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  resolvers,
  typeDefs,
})

const team =
  localStorage.getItem('team') === null ? localStorage.getItem('team') : null
const version = JSON.parse(localStorage.getItem('version')) || defaultFixVersion

cache.writeData({
  data: {
    isLoggedIn: false,
    version,
    team,
  },
})

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`

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
          {/* <Route exact path="/" component={Dashboard} /> */}
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/resources" component={Resources} />
          <Route path="/resource/:resourceId" component={Resource} />
          <Route path="/issues" component={Issues} />
          <Route path="/issue/:issueId" component={Issue} />
          <Route path="/absences" component={Absences} />
          <Route path="/projects/my-project" component={ProjectBacklogRoute} />
          <Route path="/issues" component={IssuesAndFiltersRoute} />
          <Route path="/" component={DashboardsRoute} />
        </Switch>
      </LayoutManagerWithViewController>
    )
  }
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
 * TODO: Handle authentication
 */
// const httpLink = createHttpLink({
//   uri: 'http://localhost:4000/graphql',
//   credentials: 'same-origin',
// })
// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   // const token = localStorage.getItem('token')
//   const token = apiKey
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : `Basic ${basicAuth}`,
//     },
//   }
// })

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
