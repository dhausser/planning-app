import React, { Fragment, FunctionComponent } from 'react';
import { Router } from '@reach/router';

import Dashboard from './Dashboard';
import Resource from './Resource';
import Resources from './Resources';
import Roadmap from './Roadmap';
import Issues from './Issues';
import Issue from './Issue';
import Projects from './Projects';
import Backlog from './Backlog';
import Releases from './Releases';
import Board from './Board';
import Pages from './Pages';
import AddItem from './AddItem';
import Settings from './Settings';

const AppRouter: FunctionComponent = () => (
  <Router primary={false} component={Fragment}>
    <Projects default />
    <Resource path="/resource/:resourceId" />
    <Issue path="/issue/:issueId" />
    <Settings path="/settings" />
    <Dashboard path="/reports" />
    <Releases path="/releases" />
    <Backlog path="/backlog" />
    <Board path="/board" />
    <Roadmap path="/roadmap" />
    <Resources path="/resources" />
    <Issues path="/issues" />
    <Dashboard path="/dashboards" />
    <Pages path="/pages" />
    <AddItem path="/AddItem" />
  </Router>
);

export default AppRouter;
