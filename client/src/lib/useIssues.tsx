import React, { ReactElement } from 'react';
import { useQuery, gql } from '@apollo/client';
import EmptyState from '@atlaskit/empty-state';
import { Loading } from '../components';
import { IssueConnectionData, RoadmapIssueConnectionVars } from '../types';

export const ROWS_PER_PAGE = 20;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useEpics = (): any => {
  const { loading, error, data, networkStatus } = useQuery<
    IssueConnectionData,
    RoadmapIssueConnectionVars
  >(GET_ISSUES, {
    variables: { issuetype: 'epic' },
  });
  return { loading, error, data, networkStatus };
};

// const useIssues = (): ApolloQueryResult<IssueConnectionType> => {
const useIssues = (): ReactElement => {
  const { loading, error, data } = useQuery(GET_ISSUES, {
    variables: { maxResults: ROWS_PER_PAGE },
  });

  if (loading || !data) return <Loading />;
  if (error)
    return <EmptyState header={error.name} description={error.message} />;

  return <div>{JSON.stringify(data.issues)}</div>;
};

export default useIssues;
