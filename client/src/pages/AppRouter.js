import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './App';
import Dashboard from './Dashboard';
import Roadmap from './Roadmap';
import Resources from './Resources';
import Resource from './Resource';
import Issues from './Issues';
import Issue from './Issue';
import Absences from './Absences';

export default class AppRouter extends Component {
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

AppRouter.childContextTypes = {
  navOpenState: PropTypes.object,
};
