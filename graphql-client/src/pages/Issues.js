import React, { Fragment, useState, useContext, useEffect } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import EmptyState from '@atlaskit/empty-state';
import Spinner from '@atlaskit/spinner';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import IssueList from '../components/IssueList';
import { FilterContext } from '../context/FilterContext';
import Filters from '../components/Filters';
import config from '../credentials.json';

const GET_ISSUES = gql`
  query GetIssues($jql: String, $pageSize: Int!) {
    issues(jql: $jql, pageSize: $pageSize) {
      issues {
        id
        key
        summary
        priority
        status {
          id
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
  const pageSize = 10;
  return (
    <Query query={GET_ISSUES} variables={{ jql, pageSize }}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <p>ERROR</p>;

        console.log(data.issues.issues);
        return (
          <Fragment>
            <ContentWrapper>
              <PageTitle>Issues</PageTitle>
              <Filters />
              {data.issues && data.issues.issues ? (
                <IssueList
                  issues={data.issues.issues}
                  maxResults={data.maxResults}
                  total={data.total}
                  pathname={props.location.pathname}
                  isLoading={loading}
                />
              ) : (
                <EmptyState
                  header="Fail"
                  description="Something must be wrong with the request."
                />
              )}
            </ContentWrapper>
            ;
          </Fragment>
        );
      }}
    </Query>
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
