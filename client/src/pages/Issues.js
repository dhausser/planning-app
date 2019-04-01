import React, { useState, useEffect } from 'react';
import EmptyState from '@atlaskit/empty-state';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import IssueList from '../components/IssueList';
import { fetchIssues } from '../modules/Helpers';

// function filterIssues() {
//   const { issues, resources, team } = this.context;
//   if (team != null) {
//     const resourceFilter = resources
//       .filter(resource => resource.team === team)
//       .map(({ key }) => key);
//     return issues.filter(issue =>
//       resourceFilter.includes(issue.fields.assignee.key)
//     );
//   }
//   return issues;
// }

export default function Issues(props) {
  const [data, setData] = useState({
    issues: [],
    maxResults: 0,
    total: 0,
    isLoading: true,
  });

  useEffect(() => {
    let ignore = false;

    fetchIssues(
      {
        jql:
          'statusCategory in (new, indeterminate) AND project = 10500 AND fixVersion = 16414 ORDER BY priority DESC, key ASC',
        fields: [
          'summary',
          'description',
          'status',
          'assignee',
          'creator',
          'issuetype',
          'priority',
          'fixVersions',
        ],
      },
      setData,
      ignore
    );
    return () => {
      ignore = true;
    };
  }, []);

  const { issues, maxResults, total, isLoading } = data;

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
          pathname={props.location.pathname}
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
