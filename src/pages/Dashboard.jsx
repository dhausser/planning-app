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

  aggregateIssues = ({teams, resources}) => {
    const { filter } = this.state;
    let dataset = null;

    if (filter == null) {
      dataset = teams.reduce((accumulator, currentValue) => {
        accumulator[currentValue] = 0;
        return accumulator;
      }, {});
  
      resources.forEach(resource => {
        dataset[resource.team] += resource.issues.length;
      });
    } else {
      dataset = resources
        .filter(resource => resource.team === filter)
        .reduce((accumulator, currentValue) => {
          accumulator[currentValue.name.split(" ").shift()] = currentValue.issues.length;
          return accumulator;
        }, {})
    };

    return dataset;
  }

  render() {
    const { isLoading } = this.props;
    const { filter } = this.state;

    return (
      <ContentWrapper>
        <PageTitle>Dashboard</PageTitle>
        <TeamFilter
          {...this.props}
          filter={filter}
          updateFilter={this.updateFilter} />
        {!isLoading && 
          <BarChart dataset={this.aggregateIssues({...this.props})} />
        }
      </ContentWrapper>
    );
  }
}
