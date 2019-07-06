import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import {
  ProductIssuesView, ProjectFilter, VersionFilter, TeamFilter,
} from '..';
import IssueTable from './IssueTable';
import { GET_FILTERS, GET_RESOURCES, GET_ISSUES } from '../../queries';

export function useIssues(query = GET_ISSUES, resourceId = null) {
  const { data: { project, version, team } } = useQuery(GET_FILTERS);
  const {
    data: { resources },
    loading: loadingResources,
    error: errorResources,
  } = useQuery(GET_RESOURCES);

  const assignee = resourceId || (team && !loadingResources && !errorResources
    ? resources
      .filter(resource => resource.team === team.id)
      .map(({ key }) => key)
    : null);

  const jql = `${project ? `project=${project.id} and ` : ''}${version
    ? `fixVersion in (${version.id}) and ` : ''}${assignee
    ? `assignee in (${assignee}) and ` : ''}statusCategory in (new, indeterminate)\
    order by priority desc, key asc`;

  const issues = useQuery(query, { variables: { jql, startAt: 0, maxResults: 20 } });

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
  const issues = useIssues(GET_ISSUES);

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
