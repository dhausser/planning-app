import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';

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
  <Switch>
    <Route path="/" exact component={Projects} />
    <Route path="/resource/:resourceId" component={Resource} />
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
  </Switch>
);

export default AppRouter;
