import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import Avatar from '@atlaskit/avatar';
import EmptyState from '@atlaskit/empty-state';
import Page, { AvatarWrapper } from '../components/Page';
import {
  ProjectHomeView,
  Header,
  Loading,
  DynamicTable,
  AbsencesTable,
} from '../components';
import { GET_RESOURCE_NAME, GET_ISSUES } from '../queries';
import { useIssues } from './Issues';
import { host } from '../config';

function Resource({ navigationViewController, match }) {
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  // Extract resource id from url parameters
  const { resourceId } = match.params;

  // Fetch resource from database
  const {
    data: { resource },
    loading: loadingResource,
    error: errorResource,
  } = useQuery(GET_RESOURCE_NAME, {
    variables: { id: resourceId },
    fetchPolicy: 'cache-first',
  });

  // Fetch issues from REST API
  const [issues, { version }] = useIssues(GET_ISSUES, resourceId);
  const {
    data, loading: loadingIssues, error, fetchMore,
  } = issues;

  if (loadingResource) return <Loading />;
  if (errorResource) {
    return (
      <EmptyState
        header={errorResource.name}
        description={errorResource.message}
      />
    );
  }


  const avatar = (
    <AvatarWrapper>
      <Avatar
        name={resource.name}
        size="large"
        src={`https://${host}/secure/useravatar?ownerId=${resourceId}`}
      />
    </AvatarWrapper>
  );

  const link = (
    <p>
      <a
        href={`https://${host}/issues/?jql=assignee=${resourceId}${version
          ? ` AND fixVersion=${version.id}` : ''} AND statusCategory != Done order by priority desc`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View in Issue Navigator
      </a>
    </p>
  );

  return (
    <Page>
      <Header title={resource.name} avatar={avatar} />
      {link}
      {error ? (
        <EmptyState header={error.name} description={error.message} />
      ) : (
        <DynamicTable
          {...data.issues}
          fetchMore={fetchMore}
          loading={loadingIssues}
        />
      )}
      <AbsencesTable resourceId={resourceId} />
    </Page>
  );
}

Resource.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
  match: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Resource);
