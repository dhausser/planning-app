import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './App';
import HomePage from '../pages/HomePage';
import RoadmapPage from '../pages/RoadmapPage';
import ResourcesPage from '../pages/ResourcesPage';
import ProfilePage from '../pages/ProfilePage';
import IssuesPage from '../pages/IssuesPage';
import HolidaysPage from '../pages/HolidaysPage';
import SettingsPage from '../pages/SettingsPage';

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
          <IndexRoute component={HomePage} />
          <Route path="/roadmap" component={RoadmapPage} />
          <Route path="/resources" component={ResourcesPage} />
          <Route path="/view/:resourceId" component={ProfilePage} />`
          <Route path="/issues" component={IssuesPage} />
          <Route path="/holidays" component={HolidaysPage} />
          <Route path="/settings" component={SettingsPage} />
        </Route>
      </Router>
    );
  }
}

AppRouter.childContextTypes = {
  navOpenState: PropTypes.object,
}
