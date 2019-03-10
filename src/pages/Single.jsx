import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import { Status } from '@atlaskit/status';
import { priorityIcon, statusColor } from '../components/IssueList';
import { NameWrapper } from '../components/ResourceList';

export default class Single extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    issues: PropTypes.array,
    resources: PropTypes.array,
  };

  render() {
    const { issueId } = this.props.params;
    const { issues, resources, isLoading } = this.context;
    const issue = issues.find(issue => issue.key === issueId);
    const resource = resources.find(resource => resource.key === issue.assignee);
    console.log(issue)
  
    return (
      <ContentWrapper>
        {!isLoading && issue
          && (
            <div>
              <PageTitle>{issue.summary}</PageTitle>
              <a href={`https://jira.cdprojektred.com/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">View in Issue Navigator</a>
              <p><Status text={issue.status} color={statusColor(issue)} /></p>
              <p>{priorityIcon(issue)} {issue.priority} {issue.issuetype}</p>
              <p>{issue.summary}</p>
              <p>
                <NameWrapper>
                  <Link to={`/profile/${resource.key}`}>{resource.name}</Link>
                </NameWrapper>
              </p>
            </div>
          )}
      </ContentWrapper>
    )
  }
}
