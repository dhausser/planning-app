import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Padding } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import TeamFilter from '../components/TeamFilter';
import IssueList from '../components/IssueList';

export default class Issues extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    filter: PropTypes.string,
    issues: PropTypes.array,
    resources: PropTypes.array,
  };

  static propTypes = {
    location: PropTypes.object,
  };

  render() {
    const { location } = this.props;
    const { pathname } = location;
    const { resources, filter, isLoading } = this.context;
    const issues = [];
    issues.push = resources
      .filter(({ team }) => [null, team].includes(filter))
      .forEach(resource => issues.push(...resource.issues));

    return (
      <Padding>
        <PageTitle>Issues</PageTitle>
        <TeamFilter />
        <IssueList issues={issues} isLoading={isLoading} pathname={pathname} />
      </Padding>
    );
  }
}
