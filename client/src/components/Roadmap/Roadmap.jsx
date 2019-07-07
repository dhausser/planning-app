import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { Status } from '@atlaskit/status';
import EmptyState from '@atlaskit/empty-state';
import Page from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import {
  ProjectHomeView, ProjectFilter, VersionFilter, Loading, Icon,
} from '..';
import EpicTree from './EpicTree';

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

const GET_EPICS = gql`
  query issueList($jql: String, $startAt: Int, $maxResults: Int) {
    issues(jql: $jql, startAt: $startAt, maxResults: $maxResults) {
      issues {
        ...RoadmapRow
      }
    }
  }
  ${ROADMAP_ROW_DATA}
`;

const GET_STORIES = gql`
  query issueList($jql: String, $startAt: Int, $maxResults: Int) {
    issues(jql: $jql, startAt: $startAt, maxResults: $maxResults) {
      issues {
        ...RoadmapRow
        children {
          ...RoadmapRow
        }
        parent
      }
    }
  }
  ${ROADMAP_ROW_DATA}
`;

const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flex: '0 0 200px' }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <ProjectFilter />
    <VersionFilter />
  </div>
);

/**
 *
 * @param {Object} issue to be reduced
 */
function reducer(issue) {
  return {
    key: issue.key,
    summary: issue.summary,
    assignee: issue.assignee ? issue.assignee : { key: '', name: 'Unassigned' },
    type: Icon[issue.type],
    priority: Icon[issue.priority],
    status: (
      <Status text={issue.status.name} color={Icon[issue.status.category]} />
    ),
    children: issue.children ? issue.children.map(child => reducer(child)) : [],
  };
}

/**
 * Roadmap page functional component
 * @param {Object} navigationViewController controlling the navigation bar display
 */
function Roadmap({ navigationViewController }) {
  let content;
  let epics;
  let stories;
  let jql;

  // Fetching Project and Version
  const { data: { project, version } } = useQuery(GET_FILTERS);

  // Fetching Epics from Project and Version
  jql = `issuetype=epic\
  ${project ? `and project=${project.id}` : ''}\
  ${version ? `and fixVersion=${version.id}` : ''}\
  and status not in (Closed) order by key asc`;

  epics = useQuery(GET_EPICS, { variables: { jql, maxResults: 100 } });

  // Fetching User Stories from Epics
  jql = `issuetype=story\
  ${epics.data.issues && epics.data.issues.issues.length ? `and 'Epic Link' in (
  ${epics.data.issues.issues.map(({ id }) => id)})` : ''}\
  order by key asc`;

  stories = useQuery(GET_STORIES, { variables: { jql, maxResults: 100 } });

  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  if (epics.loading || stories.loading) {
    content = <Loading />;
  }
  if (epics.error) {
    content = (
      <EmptyState
        header={epics.error.name || stories.error.name}
        description={epics.error.message || stories.error.message}
      />
    );
  } else if (!epics.data.issues || !stories.data.issues) {
    epics = [];
    content = <EpicTree epics={epics} />;
  } else {
    // Reducing data model if fetching was successfull
    epics = epics.data.issues.issues;
    stories = stories.data.issues.issues;

    // Mapping User Stories to corresponding Epic
    epics = epics.map((epic) => {
      const children = [];
      stories.forEach((child) => {
        if (child.parent === epic.key) {
          children.push(child);
          stories.pop(child);
        }
      });
      return Object.assign({}, { ...epic, children });
    });

    // Reducing data model to a hierarchical tree of parent and children
    epics = epics.map(issue => reducer(issue)) || [];
    content = <EpicTree epics={epics} />;
  }

  return (
    <Page>
      <PageHeader bottomBar={barContent}>Roadmap</PageHeader>
      {content}
    </Page>
  );
}

Roadmap.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Roadmap);
