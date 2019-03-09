import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Page from '@atlaskit/page';
import '@atlaskit/css-reset';

import StarterNavigation from '../components/atlaskit/StarterNavigation';

export default class App extends Component {
  state = {
    isLoading: true,
    holidays: [],
    issues: [],
    resources: [],
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
    showModal: PropTypes.func,
    addFlag: PropTypes.func,
  };

  getChildContext() {
    return {
      showModal: this.showModal,
      addFlag: this.addFlag,
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

  filterTeam = () => {
    console.log('Filtering team...')
  }

  async componentDidMount() {
    const response = await fetch('/api/issues');
    const issues = await response.json();

    const holidaysPromise = fetch('/api/holidays');
    const resourcesPromise = fetch('/api/resources');
    const [holidaysResponse, resourcesResponse] = await Promise.all([
      holidaysPromise, resourcesPromise
    ]);
    const [holidays, resources] = await Promise.all([
      holidaysResponse.json(), resourcesResponse.json()
    ]);

    this.setState({ holidays, issues, resources, isLoading: false });
  }

  render() {
    return (
      <Page
        navigationWidth={this.context.navOpenState.width}
        navigation={<StarterNavigation />}
      >
        {React.cloneElement(this.props.children, this.state)}
      </Page>
    );
  }
}
