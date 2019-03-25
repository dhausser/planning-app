import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Page from '@atlaskit/page';
import StarterNavigation from '../components/StarterNavigation';

export default class App extends Component {
  state = {
    isLoading: true,
    isFiltering: false,
    themeMode: 'light',
    project: 'GWENT',
    issues: [],
    resources: [],
    teams: [],
    filter: null,
    fixVersions: ['2.0', '2.0.1', '2.1', '3.0'],
    fixVersion: null,
  };

  static contextTypes = {
    navOpenState: PropTypes.object,
    router: PropTypes.object,
  };

  static propTypes = {
    children: PropTypes.node,

    // TODO: change navOpenState on click or resize
    // navOpenState: PropTypes.object,
    // onNavResize: PropTypes.func,
  };

  static childContextTypes = {
    isLoading: PropTypes.bool,
    isFiltering: PropTypes.bool,
    updateFilter: PropTypes.func,
    filter: PropTypes.string,
    project: PropTypes.string,
    issues: PropTypes.array,
    resources: PropTypes.array,
    teams: PropTypes.array,
    themeMode: PropTypes.string,
    switchTheme: PropTypes.func,
    fixVersions: PropTypes.array,
    fixVersion: PropTypes.string,
  };

  getChildContext() {
    return {
      ...this.state,
      updateFilter: this.updateFilter,
    };
  }

  async componentDidMount() {
    const filter = JSON.parse(localStorage.getItem('filter'));
    const fixVersion =
      JSON.parse(localStorage.getItem('fixVersion')) ||
      'earliestUnreleasedVersion(GWENT)';

    const resourcesPromise = await fetch('/api/resources');
    const teamsPromise = await fetch('/api/teams');
    const resources = await resourcesPromise.json();
    const teams = await teamsPromise.json();
    // console.log({ filter, fixVersion, resources, teams });

    const { project } = this.state;
    // const assignees = resources
    //   .filter(({ team }) => team === filter)
    //   .map(({ key }) => key);
    const jql = encodeURI(
      [
        `project=${project}`,
        // `assignee in (${assignees})`,
        `fixVersion=${fixVersion}`,
      ].join(' AND ')
    );
    const response = await fetch(`/api/search?jql=${jql}`);
    const issues = await response.json();

    this.setState({
      isLoading: false,
      issues,
      resources,
      teams,
      filter,
      fixVersion,
    });
  }

  showModal = () => {
    this.setState({ isModalOpen: true });
  };

  hideModal = () => {
    this.setState({ isModalOpen: false });
  };

  addFlag = () => {
    const { flags } = this.state;
    this.setState({ flags: [{ id: Date.now() }].concat(flags) });
  };

  onFlagDismissed = dismissedFlagId => {
    const { flags } = this.state;
    this.setState({
      flags: flags.filter(flag => flag.id !== dismissedFlagId),
    });
  };

  switchTheme = () => {
    const { themeMode } = this.state;
    this.setState({
      themeMode: themeMode === 'light' ? 'dark' : 'light',
    });
  };

  updateFilter = ({ team, fixVersion }) => {
    console.log({ team, fixVersion });
    const { filter, isFiltering } = this.state;

    if (fixVersion) this.setState({ fixVersion });

    if (team)
      this.setState({
        filter: filter === team ? null : team,
        isFiltering: !isFiltering,
      });
  };

  render() {
    const { isLoading } = this.state;
    const { navOpenState } = this.context;
    const { children } = this.props;

    if (isLoading) return <p>Loading...</p>;
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
