import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './App';
import Dashboard from './Dashboard';
import Roadmap from './Roadmap';
import Resources from './Resources';
import Profile from './Profile';
import Issues from './Issues';
import Single from './Single';
import Holidays from './Holidays';
import Settings from './Settings';

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
          <Route path="/profile/:resourceId" component={Profile} />`
          <Route path="/issues" component={Issues} />
          <Route path="/single/:issueId" component={Single} />`
          <Route path="/holidays" component={Holidays} />
          <Route path="/settings" component={Settings} hello={'Hello!'} />
        </Route>
      </Router>
    );
  }
}

AppRouter.childContextTypes = {
  navOpenState: PropTypes.object,
}
