import React from 'react';
import { Link } from 'react-router';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import { Status } from '@atlaskit/status';
import { priorityIcon, statusColor } from '../components/IssueList';
import { NameWrapper } from '../components/ResourceList';

const Single = props => {
  const { issueId } = props.params;
  const { issues, resources } = props;
  const issue = issues.find(issue => issue.key === issueId);
  const resource = resources.find(resource => resource.key === issue.assignee);
  console.log(issue)

  return (
    <ContentWrapper>
      {issue
        && (
          <div>
            <PageTitle>{issue.summary}</PageTitle>
            <a href={`https://jira.cdprojektred.com/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">View in Issue Navigator</a>
            <p><Status text={issue.status} color={statusColor(issue)} /></p>
            <p>{priorityIcon(issue)} {issue.priority}</p>
            <p>{issue.summary}</p>
            <p>
            <NameWrapper>
              <Link to={`/resources/${resource.key}`}>{resource.name}</Link>
            </NameWrapper>
            </p>
          </div>
        )}
    </ContentWrapper>
  )
}

export default Single;

