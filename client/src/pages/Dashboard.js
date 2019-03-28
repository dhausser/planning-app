import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import BarChart from '../components/BarChart';
// import { filterIssues } from './Issues';

export default class Dashboard extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    // team: PropTypes.string,
    // teams: PropTypes.array,
    resources: PropTypes.array,
    issues: PropTypes.array,
  };

  aggregateIssues = () => {
    const { issues } = this.context;

    if (!issues) return {};

    // By Team Aggregation
    return issues.reduce((resources, issue) => {
      const name = issue.fields.assignee.displayName.split(' ').shift();
      if (!resources[name]) {
        resources[name] = 0;
      }
      resources[name] += 1;

      return resources;
    }, {});

    // By Resources Aggregation
    // return resources
    //   .filter(resource => resource.team === team)
    //   .reduce((accumulator, currentValue) => {
    //     accumulator[currentValue.name.split(' ').shift()] =
    //       currentValue.issues.length;
    //     return accumulator;
    //   }, {});
  };

  render() {
    const { isLoading } = this.context;
    return (
      <ContentWrapper>
        <PageTitle>Dashboard</PageTitle>
        <Filters />
        <ContentWrapper>
          {!isLoading && <BarChart dataset={this.aggregateIssues()} />}
        </ContentWrapper>
      </ContentWrapper>
    );
  }
}
