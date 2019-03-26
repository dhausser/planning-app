import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Page from '@atlaskit/page';
import StarterNavigation from '../components/StarterNavigation';

export default class App extends Component {
  state = {
    isLoading: true,
    maxResults: 0,
    total: 0,
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
    maxResults: PropTypes.number,
    total: PropTypes.number,
    issues: PropTypes.array,
    resources: PropTypes.array,
    teams: PropTypes.array,
    team: PropTypes.string,
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

    /**
     * TODO: Make a function
     */
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jql: `fixVersion in (${this.state.fixVersion}) ORDER BY priority DESC`,
        maxResults: 20,
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
    const { issues, maxResults, total } = await response.json();
    /**
     * End of function block
     */

    this.setState({
      isLoading: false,
      maxResults,
      total,
      issues,
      resources,
      teams,
    });
  }

  updateFilter = async ({ team, fixVersion }) => {
    if (fixVersion) {
      this.setState({ fixVersion, isLoading: true });
      localStorage.setItem('fixVersion', JSON.stringify(fixVersion));

      /**
       * TODO: Make a function
       */
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jql: `fixVersion=${this.state.fixVersion} ORDER BY priority DESC`,
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
      const { issues, maxResults, total } = await response.json();
      /**
       * End of function block
       */

      this.setState({
        issues,
        fixVersion,
        maxResults,
        total,
        isLoading: false,
      });
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
