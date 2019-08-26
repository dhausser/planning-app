import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';

import {
  ProductIssuesView,
  Layout,
  ProjectFilter,
  VersionFilter,
  StatusFilter,
  TeamFilter,
  IssueTable,
  LoadButton,
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
  query GetIssues($projectId: String,$versionId: String, $statusId: String, $teamId: String, $resourceId: String, $startAt: Int, $maxResults: Int) {
    projectId @client @export(as: "projectId")
    versionId @client @export(as: "versionId")
    statusId @client @export(as: "statusId")
    teamId @client @export(as: "teamId")
    issues(projectId: $projectId, versionId: $versionId, statusId: $statusId, teamId: $teamId, resourceId: $resourceId, startAt: $startAt, maxResults: $maxResults) {
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
    <StatusFilter />
    <TeamFilter />
  </div>
);

function Issues({ navigationViewController }) {
  const [length, setLength] = useState(0);
  const { loading, error, data: { issues }, fetchMore } = useQuery(GET_ISSUES, {
    variables: { maxResults: ROWS_PER_PAGE },
  });

  useEffect(() => {
    navigationViewController.setView(ProductIssuesView.id);
    if (issues && issues.issues.length) {
      setLength(issues.issues.length);
    }
  }, [navigationViewController, issues]);

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>Search Issues</PageHeader>
      <IssueTable
        loading={loading}
        error={error}
        issues={issues}
        rowsPerPage={ROWS_PER_PAGE + length}
        startAt={length}
      />
      {issues
        && issues.total > length
        && <LoadButton fetchMore={fetchMore} startAt={length} />}
    </Layout>
  );
}

Issues.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Issues);
