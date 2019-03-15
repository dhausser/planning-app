import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Page from '@atlaskit/page';
import '@atlaskit/css-reset';

import StarterNavigation from './StarterNavigation';

export default class App extends Component {
  state = {
    isLoading: true,
    isFiltering: false,
    themeMode: 'light',
    filter: null,
    resources: [],
    holidays: [],
    issues: [],
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
  }

  hideModal = () => {
    this.setState({ isModalOpen: false });
  }

  addFlag = () => {
    this.setState({ flags: [{ id: Date.now() }].concat(this.state.flags) });
  }

  onFlagDismissed = (dismissedFlagId) => {
    this.setState({
      flags: this.state.flags.filter(flag => flag.id !== dismissedFlagId),
    })
  }

  switchTheme = () => {
    this.setState({
      themeMode: this.state.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  updateFilter = (selection) => {
    const { filter, isFiltering } = this.state;
    this.setState({
      filter: ((filter === selection) ? null : selection),
      isFiltering: !isFiltering,
    })
  };

  async componentDidMount() {
    const [resourcesResponse, holidaysResponse] = await Promise.all([
      fetch('/api/resources'), fetch('/api/holidays')
    ]);
    const [resources, holidays] = await Promise.all([
      resourcesResponse.json(), holidaysResponse.json()
    ]);
    const teams = [...new Set(resources.map(resource => resource.team))];
    this.setState({ resources, teams, holidays, isLoading: false });
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
