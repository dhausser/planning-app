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
  query issueList($jql: String, $startAt: Int, $maxResults: Int) {
    issues(jql: $jql, startAt: $startAt, maxResults: $maxResults) {
      ...IssuePagination
      issues {
        ...IssueTile
      }
    }
  }
  ${ISSUE_PAGINATION}
  ${ISSUE_TILE_DATA}
`;

const GET_RESOURCES = gql`
  query resourceList {
    resources {
      key
      name
      team
    }
  }
`;

const GET_VISIBILITY_FILTER = gql`
  query GetVisibilityFilter {
    visibilityFilter @client {
      project {
        id
        name
      }
      version {
        id
        name
      }
      team {
        id
      }
    }
  }
`;

export function useIssues({
  query = GET_ISSUES, resourceId = null, startAt = 0, maxResults = 20,
}) {
  const { data: { visibilityFilter: { project, version, team } } } = useQuery(GET_VISIBILITY_FILTER);

  const {
    data: { resources },
    loading: loadingResources,
    error: errorResources,
  } = useQuery(GET_RESOURCES);

  const assignee = resourceId
    || (team && !loadingResources && !errorResources
      ? resources
        .filter(resource => resource.team === team.id)
        .map(({ key }) => key)
      : null);

  const jql = `\
  ${project ? `project=${project.id} and ` : ''}\
  ${version ? `fixVersion in (${version.id}) and ` : ''}\
  ${assignee ? `assignee in (${assignee}) and ` : ''}\
  statusCategory in (new, indeterminate)\
  order by priority desc, key asc`;

  const issues = useQuery(query, { variables: { jql, startAt, maxResults } });

  return issues;
}

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
  const issues = useIssues({ query: GET_ISSUES });

  useEffect(() => {
    navigationViewController.setView(ProductIssuesView.id);
  }, [navigationViewController]);

  return (
    <>
      <PageHeader bottomBar={barContent}>Search Issues</PageHeader>
      <IssueTable {...issues} />
    </>
  );
}

Issues.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Issues);
