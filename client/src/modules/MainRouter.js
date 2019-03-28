import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './App';
import Dashboard from '../pages/Dashboard';
import Roadmap from '../pages/Roadmap';
import Resources from '../pages/Resources';
import Resource from '../pages/Resource';
import Issues from '../pages/Issues';
import Issue from '../pages/Issue';
import Absences from '../pages/Absences';

export default class MainRouter extends Component {
  constructor() {
    super();
    this.state = {
      navOpenState: {
        isOpen: true,
        width: 304,
      },
    };
  }

  getChildContext() {
    const { navOpenState } = this.state;
    return {
      navOpenState,
    };
  }

  appWithPersistentNav = () => props => (
    <App onNavResize={this.onNavResize} {...props} />
  );

  onNavResize = navOpenState => {
    this.setState({
      navOpenState,
    });
  };

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={this.appWithPersistentNav()}>
          <IndexRoute component={Dashboard} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/resources" component={Resources} />
          <Route path="/resource/:resourceId" component={Resource} />`
          <Route path="/issues" component={Issues} />
          <Route path="/issue/:issueId" component={Issue} />`
          <Route path="/absences" component={Absences} />
        </Route>
      </Router>
    );
  }
}

MainRouter.childContextTypes = {
  navOpenState: PropTypes.object,
};
