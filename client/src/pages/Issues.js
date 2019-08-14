import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import Button from '@atlaskit/button';

import {
  ProductIssuesView, Layout, ProjectFilter, VersionFilter, TeamFilter, IssueTable,
} from '../components';

const ROWS_PER_PAGE = 10;

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

const GET_ISSUES = gql`
  query GetIssues($projectId: String, $versionId: String, $teamId: String, $resourceId: String, $startAt: Int, $maxResults: Int) {
    filter @client {
      project {
        id @export(as: "projectId")
      }
      version {
        id @export(as: "versionId")
      }
      team {
        id @export(as: "teamId")
      }
    }
    issues(projectId: $projectId, versionId: $versionId, teamId: $teamId, resourceId: $resourceId, startAt: $startAt, maxResults: $maxResults) {
      ...IssuePagination
      issues {
        ...IssueRow
      }
    }
  }
  ${ISSUE_PAGINATION}
  ${ISSUE_ROW_DATA}
`;

const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flexBasis: 150, marginRight: 8 }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <ProjectFilter />
    <VersionFilter />
    <TeamFilter />
  </div>
);

function Issues({ navigationViewController }) {
  const [offset, setOffset] = useState(ROWS_PER_PAGE);
  const issues = useQuery(GET_ISSUES, { variables: { maxResults: ROWS_PER_PAGE } });
  const {
    loading, error, data, fetchMore,
  } = issues;

  useEffect(() => navigationViewController.setView(ProductIssuesView.id),
    [navigationViewController]);

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>Search Issues</PageHeader>
      <IssueTable
        loading={loading}
        error={error}
        data={data}
        rowsPerPage={ROWS_PER_PAGE + offset}
        offset={offset}
      />
      {data.issues && data.issues.total > offset && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
          <Button
            onClick={() => {
              setOffset(offset + data.issues.maxResults);
              return fetchMore({
                variables: { startAt: offset },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...fetchMoreResult,
                    issues: {
                      ...fetchMoreResult.issues,
                      issues: [
                        ...prev.issues.issues,
                        ...fetchMoreResult.issues.issues,
                      ],
                    },
                  };
                },
              });
            }}
          >
            Load More
          </Button>
        </div>
      )}
    </Layout>
  );
}

Issues.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Issues);
