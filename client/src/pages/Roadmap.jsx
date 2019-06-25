import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { Status } from '@atlaskit/status';
import EmptyState from '@atlaskit/empty-state';
import {
  ProjectHomeView,
  Page,
  Header,
  Loading,
  EpicTree,
} from '../components';
import Icon from '../components/IssueView/Icon';
import { GET_FILTERS, GET_ISSUES, GET_STORIES } from '../queries';

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

function Roadmap({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  const { data: { project, version } } = useQuery(GET_FILTERS);

  let jql = `issuetype=epic ${
    project ? `and project=${project.id}` : ''
  }${
    version ? `and fixVersion=${version.id}` : ''
  } order by key desc`;

  let epics = useQuery(GET_ISSUES, {
    variables: { jql },
    fetchPolicy: 'network-only',
  });

  jql = `${
    epics.data.issues && epics.data.issues.issues.length
      ? `'Epic Link' in (${epics.data.issues.issues.map(({ id }) => id)
      }) and ` : ''
  }${
    version ? `fixVersion in (${version.id}) and ` : ''
  } issuetype=story order by key asc`;

  let stories = useQuery(GET_STORIES, {
    variables: { jql },
    fetchPolicy: 'network-only',
  });

  let issues = [];

  if (!epics.loading && !stories.loading) {
    epics = epics.data.issues.issues;
    stories = stories.data.issues.issues;

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

    issues = epics.map(issue => reducer(issue)) || [];
  }

  if (epics.loading || stories.loading) return <Loading />;
  if (epics.error) {
    return (
      <EmptyState header={epics.error.name} description={epics.error.message} />);
  }
  if (stories.error) {
    return (
      <EmptyState header={stories.error.name} description={stories.error.message} />);
  }

  return (
    <Page>
      <Header title="Roadmap" />
      <EpicTree issues={issues} />
    </Page>
  );
}

Roadmap.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Roadmap);
