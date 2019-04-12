import React, { useState, useContext, useEffect } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import EmptyState from '@atlaskit/empty-state';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import IssueList from '../components/IssueList';
import { FilterContext } from '../context/FilterContext';
import Filters from '../components/Filters';
import config from '../credentials.json';

const GET_ISSUES = gql`
  query GetIssues($jql: String, $pageSize: Int!) {
    issues(jql: $jql, pageSize: $pageSize) {
      startAt
      maxResults
      total
      issues {
        id
        key
        summary
        type
        priority
        status {
          name
          category
        }
        fixVersion {
          id
          name
        }
        assignee {
          id
          name
        }
        reporter {
          id
          name
        }
      }
    }
  }
`;
export default function Issues(props) {
  const { fixVersion } = useContext(FilterContext);
  const jql = `project = 10500 AND fixVersion = ${fixVersion.id}`;
  return (
    <ContentWrapper>
      <PageTitle>Issues</PageTitle>
      <Filters />
      <Query query={GET_ISSUES} variables={{ jql, pageSize: 15 }}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error)
            return (
              <EmptyState
                header="Fail"
                description="Something must be wrong with the request."
              />
            );
          console.log(data);
          return (
            <IssueList
              issues={data.issues.issues ? data.issues.issues : []}
              maxResults={data.issues.maxResults}
              total={data.issues.total}
              pathname={props.location.pathname}
              isLoading={loading}
            />
          );
        }}
      </Query>
    </ContentWrapper>
  );
}

export function useIssues(jql) {
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

/**
 * TODO: Implement team filter
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
