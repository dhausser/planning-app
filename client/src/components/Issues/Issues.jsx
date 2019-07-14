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

const ISSUE_TILE_DATA = gql`
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

const ISSUE_PAGINATION = gql`
  fragment IssuePagination on IssueConnection {
    startAt
    maxResults
    total
  }
`;

export const GET_ISSUES = gql`
  query issueList($jql: String, $startAt: Int, $maxResults: Int, $isLoggedIn: Boolean, $projectId: String, $versionId: String, $teamId: String, $resourceId: String) {
    isLoggedIn @client @export(as: "isLoggedIn")
    projectId @client @export(as: "projectId")
    versionId @client @export(as: "versionId")
    teamId @client @export(as:"teamId")
    issues(jql: $jql, startAt: $startAt, maxResults: $maxResults, isLoggedIn: $isLoggedIn, projectId: $projectId, versionId: $versionId, teamId: $teamId, resourceId: $resourceId) {
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
      <IssueTable {...useQuery(GET_ISSUES)} />
    </>
  );
}

Issues.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Issues);
