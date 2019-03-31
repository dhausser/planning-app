import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import BarChart from '../components/BarChart';

export default class Dashboard extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    resources: PropTypes.array,
    issues: PropTypes.array,
  };

  aggregateIssues = () => {
    const { issues } = this.context;

    if (!issues) return {};

    // By Team Aggregation
    return issues.reduce((resources, issue) => {
      if (issue.fields.assignee) {
        const name = issue.fields.assignee.displayName.split(' ').shift();
        if (!resources[name]) {
          resources[name] = 0;
        }
        resources[name] += 1;
      }

      return resources;
    }, {});
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
