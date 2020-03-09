import React, { Fragment } from 'react';
import { Router } from '@reach/router';
import Dashboard from './dashboard';
import Resource from './resource';
import Resources from './resources';
import Roadmap from './roadmap';
import Issues from './issues';
import Issue from './issue';
import Projects from './projects';
import Backlog from './backlog';
import Releases from './releases';
import Board from './board';
import Pages from './pages';
import AddItem from './add-item';
import Settings from './settings';

export default () => (
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
