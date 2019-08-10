import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import { ProductIssuesView, Layout } from '..';
import { ProjectFilter, VersionFilter, TeamFilter } from '../Filters';
import IssueTable from './IssueTable';

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
  useEffect(() => {
    navigationViewController.setView(ProductIssuesView.id);
  }, [navigationViewController]);

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>Search Issues</PageHeader>
      <IssueTable {...useQuery(GET_ISSUES)} />
    </Layout>
  );
}

Issues.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Issues);