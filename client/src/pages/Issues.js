import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import EmptyState from '@atlaskit/empty-state';
import {
  ProductIssuesView,
  Page,
  Header,
  Error,
  DynamicTable,
} from '../components';
import { GET_FILTERS, GET_RESOURCES, GET_ISSUES } from '../queries';

export function useIssues(QUERY = GET_ISSUES, resourceId = null) {
  const {
    data: { project, version, team },
  } = useQuery(GET_FILTERS);
  const {
    data: { resources },
    loading,
    error,
  } = useQuery(GET_RESOURCES);

  const assignee = resourceId
    || (team && !loading && !error
      ? resources
        .filter(resource => resource.team === team.id)
        .map(({ key }) => key)
      : null);

  const jql = `${project ? `project=${project.id} and ` : ''}${
    version ? `fixVersion in (${version.id}) and ` : ''
  }${
    assignee ? `assignee in (${assignee}) and ` : ''
  }statusCategory in (new, indeterminate) order by priority desc, key asc`;

  const issues = useQuery(QUERY, {
    variables: { jql, startAt: 0, maxResults: 20 },
    fetchPolicy: 'network-only',
  });

  return [issues, { project, version, team }];
}

function Issues({ navigationViewController }) {
  const [{
    data, loading, error, fetchMore,
  }] = useIssues(GET_ISSUES);

  useEffect(() => {
    navigationViewController.setView(ProductIssuesView.id);
  }, [navigationViewController]);

  return (
    <Page>
      <Header title="Issues" />
      {error ? (
        <Error error={error} />
      ) : (
        <DynamicTable
          {...data.issues}
          fetchMore={fetchMore}
          loading={loading}
          emptyView={EmptyState}
        />
      )}
    </Page>
  );
}

Issues.propTypes = {
  navigationViewController: PropTypes.func.isRequired,
};

export default withNavigationViewController(Issues);
