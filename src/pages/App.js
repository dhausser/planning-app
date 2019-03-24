import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Page from '@atlaskit/page';
import StarterNavigation from '../components/StarterNavigation';

export default class App extends Component {
  state = {
    isLoading: true,
    isFiltering: false,
    themeMode: 'light',
    filter: null,
    jql: '',
    issues: [],
    resources: [],
    teams: [],
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
    jql: PropTypes.string,
    issues: PropTypes.array,
    resources: PropTypes.array,
    teams: PropTypes.array,
    themeMode: PropTypes.string,
    switchTheme: PropTypes.func,
  };

  getChildContext() {
    return {
      ...this.state,
      updateFilter: this.updateFilter,
    };
  }

  async componentDidMount() {
    // Reinstate our localstorage
    const localStorageRef = localStorage.getItem('filter');
    if (localStorageRef) {
      this.setState({ filter: JSON.parse(localStorageRef) });
    }

    // TODO: Implement filter selection by dropdowns in header
    const jql = encodeURI('filter=22119');
    const issuesPromise = await fetch(`/api/search?jql=${jql}`);
    // const issuesPromise = await fetch('/api/issues');
    const resourcesPromise = await fetch('/api/resources');
    const teamsPromise = await fetch('/api/teams');

    const issues = await issuesPromise.json();
    const resources = await resourcesPromise.json();
    const teams = await teamsPromise.json();

    // TODO: await and json all promises
    // const [issues, resources, teams] = await Promise.all([
    //   issuesPromise,
    //   resourcesPromise,
    //   teamsPromise,
    // ]);

    this.setState({
      isLoading: false,
      jql,
      issues,
      resources,
      teams,
    });
  }

  componentDidUpdate() {
    const { filter } = this.state;
    localStorage.setItem('filter', JSON.stringify(filter));
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

  updateFilter = selection => {
    const { filter, isFiltering } = this.state;
    this.setState({
      filter: filter === selection ? null : selection,
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
