import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  NavigationProvider,
  withNavigationViewController,
  LayoutManagerWithViewController,
} from '@atlaskit/navigation-next';

import Dashboard from './pages/Dashboard';
import Resource from './pages/Resource';
import Resources from './pages/Resources';
import Roadmap from './pages/Roadmap';
import Issues from './pages/Issues';
import Issue from './pages/Issue';
import Projects from './pages/Projects';
import Backlog from './pages/Backlog';
import Releases from './pages/Releases';
import Board from './pages/Board';
import Pages from './pages/Pages';
import AddItem from './pages/AddItem';
import Settings from './pages/Settings';
import { LoginForm } from './components';

import {
  MyGlobalNavigation,
  productHomeView,
  productIssuesView,
  projectHomeView,
} from './components/Navigation';

import client from './apollo';
import { useUserLogin } from './lib/useUser';

interface NavigationViewController {
  navigationViewController: {
    setView: (name: object) => void;
    addView: (name: object) => void;
  };
}

const AppRouter: React.FC<NavigationViewController> = ({
  navigationViewController,
}) => {
  const isLoggedIn = useUserLogin();

  useEffect(() => {
    navigationViewController.addView(productHomeView);
    navigationViewController.addView(productIssuesView);
    navigationViewController.addView(projectHomeView);
  }, [navigationViewController]);

  return (
    <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
      {/* <Route exact path="/">
        {isLoggedIn ? <Redirect to="/projects" /> : <Redirect to="/login" />}
      </Route> */}
      {isLoggedIn ? (
        <>
          <Route path={['/', '/projects']} exact component={Projects} />
          <Route path="/resource/:id" component={Resource} />
          <Route path="/issue/:issueId" component={Issue} />
          <Route path="/settings" component={Settings} />
          <Route path="/reports" component={Dashboard} />
          <Route path="/releases" component={Releases} />
          <Route path="/backlog" component={Backlog} />
          <Route path="/board" component={Board} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/resources" component={Resources} />
          <Route path="/issues" component={Issues} />
          <Route path="/dashboards" component={Dashboard} />
          <Route path="/pages" component={Pages} />
          <Route path="/AddItem" component={AddItem} />
        </>
      ) : (
        <>
          <Route path="/login" component={LoginForm} />
          {/* <Route path={['/', '/login']} exact component={LoginForm} /> */}
        </>
      )}
    </LayoutManagerWithViewController>
  );
};

const AppWithNavigationViewController = withNavigationViewController(AppRouter);

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <Router>
      <NavigationProvider>
        <AppWithNavigationViewController />
      </NavigationProvider>
    </Router>
  </ApolloProvider>
);

export default App;
