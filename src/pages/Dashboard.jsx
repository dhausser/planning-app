import React, { Component } from 'react';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import TeamFilter from '../components/TeamFilter';
import BarChart from '../components/BarChart';

export default class Dashboard extends Component {
  state = {
    filter: null,
  };

  updateFilter = (selected) => {
    const { filter } = this.state;
    this.setState({ filter: ((filter === selected) ? null : selected) })
  };

  render() {
    const { isLoading, teams } = this.props;
    const { filter } = this.state;
    return (
      <ContentWrapper>
        <PageTitle>Dashboard</PageTitle>
        <TeamFilter
          {...this.props}
          filter={filter}
          updateFilter={this.updateFilter} />
        {!isLoading && 
          <BarChart teams={teams} />
        }
      </ContentWrapper>
    );
  }
}
