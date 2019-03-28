import PropTypes from 'prop-types';
import React, { Component } from 'react';
import EmptyState from '@atlaskit/empty-state';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
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
    return (
      <ContentWrapper>
        <PageTitle>Issues</PageTitle>
        <Filters />
        {issues ? (
          <IssueList
            issues={issues}
            maxResults={maxResults}
            total={total}
            isLoading={isLoading}
            pathname={this.props.location.pathname}
          />
        ) : (
          <EmptyState
            header="Fail"
            description="Something must be wrong with the request."
          />
        )}
      </ContentWrapper>
    );
  }
}
