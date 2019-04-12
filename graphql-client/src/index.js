import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import '@atlaskit/css-reset';
import Page from '@atlaskit/page';

import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Resources from './pages/Resources';
import Resource from './pages/Resource';
import Issues from './pages/Issues';
import Issue from './pages/Issue';
import Absences from './pages/Absences';
import StarterNavigation from './components/StarterNavigation';
import { NavContext } from './context/NavContext';
import { FilterContext } from './context/FilterContext';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/',
});
const client = new ApolloClient({
  cache,
  link,
});

function App() {
  const { navOpenState } = useContext(NavContext);
  const filterContext = useContext(FilterContext);
  const [fixVersion, setFixVersion] = useState(filterContext.fixVersion);
  const [team, setTeam] = useState(filterContext.team);
  return (
    <ApolloProvider client={client}>
      <FilterContext.Provider
        value={{
          team,
          setTeam,
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
  );
}

function AppRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

ReactDOM.render(<AppRouter />, document.getElementById('root'));
