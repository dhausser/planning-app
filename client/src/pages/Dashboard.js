import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper, { Padding } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import TeamFilter from '../components/TeamFilter';
import BarChart from '../components/BarChart';

export default class Dashboard extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    team: PropTypes.string,
    teams: PropTypes.array,
    resources: PropTypes.array,
  };

  aggregateIssues = () => {
    const { team, teams, resources } = this.context;

    if (team == null) {
      const dataset = teams.reduce((accumulator, currentValue) => {
        accumulator[currentValue] = 0;
        return accumulator;
      }, {});
      resources.forEach(resource => {
        dataset[resource.team] += resource.issues.length;
      });
      return dataset;
    }
    return resources
      .filter(resource => resource.team === team)
      .reduce((accumulator, currentValue) => {
        accumulator[currentValue.name.split(' ').shift()] =
          currentValue.issues.length;
        return accumulator;
      }, {});
  };

  render() {
    const { isLoading } = this.context;

    return (
      <Padding>
        <PageTitle>Reports</PageTitle>
        <TeamFilter />
        {!isLoading && (
          <ContentWrapper>
            <BarChart dataset={this.aggregateIssues()} />
          </ContentWrapper>
        )}
      </Padding>
    );
  }
}
