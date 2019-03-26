import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Page from '@atlaskit/page';
import StarterNavigation from '../components/StarterNavigation';

export default class App extends Component {
  state = {
    isLoading: true,
    issues: [],
    resources: [],
    teams: [],
    team: null,
    fixVersions: ['2.0', '2.0.1', '2.1', '3.0'],
    fixVersion: 'unreleasedVersions()',
  };

  static contextTypes = {
    navOpenState: PropTypes.object,
    router: PropTypes.object,
  };

  static propTypes = {
    children: PropTypes.node,
    // navOpenState: PropTypes.object,
    // onNavResize: PropTypes.func,
  };

  static childContextTypes = {
    isLoading: PropTypes.bool,
    team: PropTypes.string,
    project: PropTypes.string,
    issues: PropTypes.array,
    resources: PropTypes.array,
    teams: PropTypes.array,
    fixVersions: PropTypes.array,
    fixVersion: PropTypes.string,
    updateFilter: PropTypes.func,
  };

  getChildContext() {
    return {
      ...this.state,
      updateFilter: this.updateFilter,
    };
  }

  async componentDidMount() {
    let localStorageRef = JSON.parse(localStorage.getItem('team'));
    if (localStorageRef) this.setState({ team: localStorageRef });
    localStorageRef = JSON.parse(localStorage.getItem('fixVersion'));
    if (localStorageRef) this.setState({ fixVersion: localStorageRef });

    const resourcesPromise = await fetch('/api/resources');
    const teamsPromise = await fetch('/api/teams');
    const resources = await resourcesPromise.json();
    const teams = await teamsPromise.json();

    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jql: `fixVersion in (${this.state.fixVersion})`,
        startAt: 0,
        maxResults: 10,
        fields: [
          'summary',
          'description',
          'status',
          'assignee',
          'issuetype',
          'priority',
          'creator',
          'fixVersions',
        ],
      }),
    });
    const { issues } = await response.json();

    this.setState({
      isLoading: false,
      issues,
      resources,
      teams,
    });
  }

  updateFilter = async ({ team, fixVersion }) => {
    if (fixVersion) {
      this.setState({ isLoading: true });
      localStorage.setItem('fixVersion', JSON.stringify(fixVersion));

      const jql = `fixVersion=${fixVersion || this.state.fixVersion}`;
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jql,
          startAt: 0,
          maxResults: 10,
          fields: [
            'summary',
            'description',
            'status',
            'assignee',
            'issuetype',
            'priority',
            'creator',
            'fixVersions',
          ],
        }),
      });
      const { issues } = await response.json();
      console.log(issues.length);
      this.setState({ issues, fixVersion, isLoading: false });
    }

    if (team) {
      if (team === this.state.team) {
        localStorage.removeItem('team');
        this.setState({ team: null });
      } else {
        localStorage.setItem('team', JSON.stringify(team));
        this.setState({ team });
      }
    }
  };

  render() {
    const { navOpenState } = this.context;
    const { children } = this.props;

    return (
      <Page
        navigationWidth={navOpenState.width}
        navigation={<StarterNavigation />}
      >
        {children}
      </Page>
    );
  }
}
