import React, { useState, useContext } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import '@atlaskit/css-reset'
import Page from '@atlaskit/page'

import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import Resources from './pages/Resources'
import Resource from './pages/Resource'
import Issues from './pages/Issues'
import Issue from './pages/Issue'
import Absences from './pages/Absences'
import StarterNavigation from './components/StarterNavigation'
import { NavContext } from './context/NavContext'
import { FilterContext } from './context/FilterContext'
import { basicAuth, apiKey } from './credentials'

/**
 * TODO: Handle authentication
 */

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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

function App() {
  const { navOpenState } = useContext(NavContext)
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
        <Page
          navigationWidth={navOpenState.width}
          navigation={<StarterNavigation />}
        >
          <Route exact path="/" component={Dashboard} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/resources" component={Resources} />
          <Route path="/resource/:resourceId" component={Resource} />
          <Route path="/issues" component={Issues} />
          <Route path="/issue/:issueId" component={Issue} />
          <Route path="/absences" component={Absences} />
        </Page>
      </FilterContext.Provider>
    </ApolloProvider>
  )
}

function AppRouter() {
  return (
    <Router>
      <App />
    </Router>
  )
}

ReactDOM.render(<AppRouter />, document.getElementById('root'))
