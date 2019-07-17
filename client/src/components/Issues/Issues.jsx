import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import {
  ProductIssuesView, ProjectFilter, VersionFilter, TeamFilter,
} from '..';
import IssueTable from './IssueTable';

export const ISSUE_TILE_DATA = gql`
  fragment IssueTile on Issue {
    id
    key
    summary
    type
    priority
    status {
      name
      category
    }
    fixVersions {
      id
      name
    }
    assignee {
      key
      name
      team
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
        ...IssueTile
      }
    }
  }
  ${ISSUE_PAGINATION}
  ${ISSUE_TILE_DATA}
`;

const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flex: '0 0 200px' }}>
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
    <>
      <PageHeader bottomBar={barContent}>Search Issues</PageHeader>
      <IssueTable {...useQuery(GET_ISSUES, { fetchPolicy: 'cache-and-network' })} />
    </>
  );
}

Issues.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Issues);
