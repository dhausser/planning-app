import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import EmptyState from '@atlaskit/empty-state';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import {
  ProjectHomeView, VersionFilter, Loading,
} from '..';
import EpicTree from './EpicTree';

const GET_FILTERS = gql`
  query GetFilters {
    isLoggedIn @client
    project @client {
      id
      name
    }
    version @client {
      id
      name
    }
  }
`;

const ROADMAP_ROW_DATA = gql`
  fragment RoadmapRow on Issue {
    id
    key
    summary
    type
    priority
    status {
      name
      category
    }
    assignee {
      name
    }
  }
`;

const GET_ISSUES = gql`
  query issueList($jql: String) {
    roadmapIssues(jql: $jql) {
      ...RoadmapRow
      children {
        ...RoadmapRow
      }
      parent
    }
  }
  ${ROADMAP_ROW_DATA}
`;

const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flex: '0 0 200px' }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <VersionFilter />
  </div>
);

function Roadmap({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  const { data: { project, version } } = useQuery(GET_FILTERS);

  /**
   * TODO: Adjust query for relevant results when no fixversion is selected
   */
  const jql = `${project ? `project = ${project.id} AND ` : ''}\
  ${version ? `fixVersion = ${version.id} AND ` : ''}\
  (issuetype = Epic OR issueType in (Story, Task)\
  AND "Epic Link" is not EMPTY)\
  ORDER BY issuetype ASC, priority DESC`;

  const { data, loading, error } = useQuery(GET_ISSUES, { variables: { jql } });

  return (
    <>
      <PageHeader bottomBar={barContent}>Roadmap</PageHeader>
      {error && <EmptyState header={error.name} description={error.message} />}
      {loading
        ? <Loading />
        : <EpicTree {...data} />
      }
    </>
  );
}

Roadmap.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Roadmap);
