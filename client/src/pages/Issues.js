import React, { useState, useContext, useEffect } from 'react';
import EmptyState from '@atlaskit/empty-state';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import IssueList from '../components/IssueList';
import config from '../modules/credentials.json';
import { FilterContext } from '../modules/App';

/**
 * TODO: Implement filter
 */
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

export default function Issues() {
  const { fixVersion, team } = useContext(FilterContext);
  const { issues, maxResults, total, isLoading } = useIssues();
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

function useIssues(jql) {
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
        jql,
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
  }, [jql]);
  return data;
}

export async function fetchIssues(
  bodyData = {},
  setData,
  ignore,
  resource = 'search'
) {
  const { hostname, path, Authorization } = config;

  const options = {
    method: 'POST',
    hostname,
    path: `${path}/${resource}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization,
    },
  };

  const response = await fetch(`/api/${resource}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ options, bodyData }),
  });
  const result = await response.json();
  if (!ignore) setData({ ...result, isLoading: false });
}
