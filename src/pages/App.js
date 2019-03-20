import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Page from '@atlaskit/page';
import '@atlaskit/css-reset';
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
    holidays: [],
    teams: [],
  };

  static contextTypes = {
    navOpenState: PropTypes.object,
    router: PropTypes.object,
  };

  static propTypes = {
    navOpenState: PropTypes.object,
    onNavResize: PropTypes.func,
  };

  static childContextTypes = {
    isLoading: PropTypes.bool,
    jql: PropTypes.string,
    holidays: PropTypes.array,
    issues: PropTypes.array,
    resources: PropTypes.array,
    teams: PropTypes.array,
    themeMode: PropTypes.string,
    switchTheme: PropTypes.func,
    filter: PropTypes.string,
    updateFilter: PropTypes.func,
  };

  getChildContext() {
    return {
      isLoading: this.state.isLoading,
      jql: this.state.jql,
      issues: this.state.issues,
      holidays: this.state.holidays,
      resources: this.state.resources,
      teams: this.state.teams,
      themeMode: this.state.themeMode,
      switchTheme: this.switchTheme,
      filter: this.state.filter,
      updateFilter: this.updateFilter,
    };
  }

  showModal = () => {
    this.setState({ isModalOpen: true });
  };

  hideModal = () => {
    this.setState({ isModalOpen: false });
  };

  addFlag = () => {
    this.setState({ flags: [{ id: Date.now() }].concat(this.state.flags) });
  };

  onFlagDismissed = dismissedFlagId => {
    this.setState({
      flags: this.state.flags.filter(flag => flag.id !== dismissedFlagId),
    });
  };

  switchTheme = () => {
    this.setState({
      themeMode: this.state.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  updateFilter = selection => {
    const { filter, isFiltering } = this.state;
    this.setState({
      filter: filter === selection ? null : selection,
      isFiltering: !isFiltering,
    });
  };

  async componentDidMount() {
    // Reinstate our localstorage
    const localStorageRef = localStorage.getItem('team');
    if (localStorageRef) {
      this.setState({ filter: JSON.parse(localStorageRef) });
    }

    const jql = 'filter=22119';
    let response = await fetch(`/api/search?jql=${jql}`);
    const issues = await response.json();

    response = await fetch('/api/teams');
    const { resources, teams } = await response.json();

    this.setState({
      issues,
      resources,
      teams,
      holidays: [],
      jql,
      isLoading: false,
    });
  }

  componentDidUpdate() {
    localStorage.setItem('team', JSON.stringify(this.state.filter));
  }

  render() {
    return (
      <Page
        navigationWidth={this.context.navOpenState.width}
        navigation={<StarterNavigation />}
      >
        {this.props.children}
      </Page>
    );
  }
}
