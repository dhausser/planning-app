import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Page from '@atlaskit/page';
import '@atlaskit/css-reset';

import StarterNavigation from '../components/StarterNavigation';

export const getIssues = async (data = {}) =>
  (await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })).json();

export default class App extends Component {
  state = {
    isLoading: true,
    maxResults: 0,
    total: 0,
    issues: [],
    resources: [],
    teams: [],
    team: null,
    fixVersions: [],
    fixVersion: {},
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
    fixVersion: PropTypes.object,
    updateFilter: PropTypes.func,
  };

  getChildContext() {
    return {
      ...this.state,
      updateFilter: this.updateFilter,
    };
  }

  async componentDidMount() {
    // Reinstate localstorage
    let localStorageRef = localStorage.getItem('team');
    if (localStorageRef) {
      this.setState({ team: JSON.parse(localStorageRef) });
    }
    localStorageRef = localStorage.getItem('fixVersion');
    if (localStorageRef) {
      this.setState({
        fixVersion: JSON.parse(localStorageRef),
      });
    }

    const [
      teamsPromise,
      resourcesPromise,
      fixVersionsPromise,
    ] = await Promise.all([
      fetch('/api/teams'),
      fetch('/api/resources'),
      fetch('/api/fixVersions'),
    ]);
    const [teams, resources, fixVersions] = await Promise.all([
      teamsPromise.json(),
      resourcesPromise.json(),
      fixVersionsPromise.json(),
    ]);

    const requestData = {
      jql: `filter=22119 AND fixVersion in (${
        fixVersions.values[0].id
      }) ORDER BY priority DESC`,
      maxResults: 10,
      fields: [
        'summary',
        'description',
        'status',
        'assignee',
        'creator',
        'issuetype',
        'priority',
        'fixVersions',
      ],
    };
    const { issues, maxResults, total } = await getIssues(requestData);

    this.setState({
      isLoading: false,
      maxResults,
      total,
      fixVersions: fixVersions.values,
      issues,
      resources,
      teams,
    });
  }

  updateFilter = async ({ team, fixVersion }) => {
    if (fixVersion != null) {
      this.setState({ isLoading: true });
      localStorage.setItem('fixVersion', JSON.stringify(fixVersion));

      const requestData = {
        jql: `filter=22119 AND fixVersion=${
          fixVersion.id
        } ORDER BY priority DESC`,
        maxResults: 10,
        fields: [
          'summary',
          'description',
          'status',
          'assignee',
          'creator',
          'issuetype',
          'priority',
          'fixVersions',
        ],
      };
      const { issues, maxResults, total } = await getIssues(requestData);

      this.setState({
        issues,
        fixVersion,
        maxResults,
        total,
        isLoading: false,
      });
    }

    if (team != null) {
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
