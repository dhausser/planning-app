import PropTypes from 'prop-types';
import React, { Component } from 'react';
import EmptyState from '@atlaskit/empty-state';
import { Padding } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import TeamFilter from '../components/TeamFilter';
import IssueList from '../components/IssueList';

// const reducer = (acc, val) => [...acc, ...val.issues];

export default class Issues extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    maxResults: PropTypes.number,
    total: PropTypes.number,
    issues: PropTypes.array,
    resources: PropTypes.array,
    team: PropTypes.string,
  };

  static propTypes = {
    location: PropTypes.object,
  };

  filterIssues() {
    const { issues, resources, team } = this.context;
    if (team != null) {
      const resourceFilter = resources
        .filter(resource => resource.team === team)
        .map(({ key }) => key);
      return issues.filter(issue =>
        resourceFilter.includes(issue.fields.assignee.key)
      );
    }
    return issues;
  }

  render() {
    const { maxResults, total, isLoading } = this.context;
    const issues = this.filterIssues();

    let content = null;
    if (!issues) {
      content = (
        <EmptyState
          header="Fail"
          description="Something must be wrong with the request."
        />
      );
    } else {
      content = (
        <IssueList
          issues={issues}
          maxResults={maxResults}
          total={total}
          isLoading={isLoading}
          pathname={this.props.location.pathname}
        />
      );
    }

    return (
      <Padding>
        <PageTitle>Issues</PageTitle>
        <TeamFilter />
        {content}
      </Padding>
    );
  }
}
