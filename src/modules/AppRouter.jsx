import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './App';
import Dashboard from '../pages/Dashboard';
import Roadmap from '../pages/Roadmap';
import Resources from '../pages/Resources';
import Profile from '../pages/Profile';
import Issues from '../pages/Issues';
import Single from '../pages/Single';
import Holidays from '../pages/Holidays';
import Settings from '../pages/Settings';

export default class AppRouter extends Component {
  constructor() {
    super();
    this.state = {
      navOpenState: {
        isOpen: true,
        width: 304,
      }
    }
  }

  getChildContext() {
    return {
      navOpenState: this.state.navOpenState,
    };
  }

  appWithPersistentNav = () => (props) => (
    <App
      onNavResize={this.onNavResize}
      {...props}
    />
  )

  onNavResize = (navOpenState) => {
    this.setState({
      navOpenState,
    });
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={this.appWithPersistentNav()}>
          <IndexRoute component={Dashboard} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/resources" component={Resources} />
          <Route path="/resources/:resourceId" component={Profile} />`
          <Route path="/issues" component={Issues} />
          <Route path="/issues/:issueId" component={Single} />`
          <Route path="/holidays" component={Holidays} />
          <Route path="/settings" component={Settings} />
        </Route>
      </Router>
    );
  }
}

AppRouter.childContextTypes = {
  navOpenState: PropTypes.object,
}
