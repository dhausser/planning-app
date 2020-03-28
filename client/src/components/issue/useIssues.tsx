import React from 'react';
// import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';

export const ROWS_PER_PAGE = 50;

export const ISSUE_ROW_DATA = gql`
  fragment IssueRow on Issue {
    id
    key
    fields {
      summary
      issuetype {
        id
        name
      }
      priority {
        id
        name
      }
      status {
        name
        statusCategory {
          id
        }
      }
      fixVersions {
        id
        name
      }
      assignee {
        key
        displayName
      }
    }
  }
`;

export const ISSUE_PAGINATION = gql`
  fragment IssuePagination on IssueConnection {
    startAt
    maxResults
    total
  }
`;

export const GET_ISSUES = gql`
  query GetIssues(
    $projectId: String
    $versionId: String
    $statusId: String
    $teamId: String
    $resourceId: String
    $startAt: Int
    $maxResults: Int
  ) {
    projectId @client @export(as: "projectId")
    versionId @client @export(as: "versionId")
    statusId @client @export(as: "statusId")
    teamId @client @export(as: "teamId")
    issues(
      projectId: $projectId
      versionId: $versionId
      statusId: $statusId
      teamId: $teamId
      resourceId: $resourceId
      startAt: $startAt
      maxResults: $maxResults
    ) {
      ...IssuePagination
      issues {
        ...IssueRow
      }
    }
  }
  ${ISSUE_PAGINATION}
  ${ISSUE_ROW_DATA}
`;

const useIssues = () => {
  const { loading, error, data } = useQuery(GET_ISSUES, {
    variables: { maxResults: ROWS_PER_PAGE },
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return <div>{JSON.stringify(data.issues)}</div>;
};

// useIssues.propTypes = {

// };

export default useIssues;
