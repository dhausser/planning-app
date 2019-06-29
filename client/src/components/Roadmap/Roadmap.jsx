import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { Status } from '@atlaskit/status';
import EmptyState from '@atlaskit/empty-state';
import Page from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import {
  ProjectHomeView, Loading, Icon,
} from '..';
import EpicTree from './EpicTree';
import { GET_FILTERS, GET_ISSUES, GET_STORIES } from '../../queries';

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
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  let content;
  let epics;
  let stories;
  let jql;

  // Fetching Project and Version
  const { data: { project, version } } = useQuery(GET_FILTERS);

  // Fetching Epics from Project and Version
  jql = `issuetype=epic${project
    ? ` and project=${project.id}` : ''}${version
    ? ` and fixVersion=${version.id}` : ''} order by key desc`;
  epics = useQuery(GET_ISSUES, { variables: { jql } });

  // Fetching User Stories from Epics
  jql = `issuetype=story${epics.data.issues && epics.data.issues.issues.length
    ? ` and 'Epic Link' in (${epics.data.issues.issues.map(({ id }) => id)})` : ''}${version
    ? ` and fixVersion=${version.id}` : ''} order by key asc`;
  stories = useQuery(GET_STORIES, { variables: { jql } });

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
      <PageHeader>Roadmap</PageHeader>
      {content}
    </Page>
  );
}

Roadmap.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Roadmap);