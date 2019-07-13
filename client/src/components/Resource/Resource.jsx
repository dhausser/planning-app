import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import styled from 'styled-components';

import { withNavigationViewController } from '@atlaskit/navigation-next';
import Avatar from '@atlaskit/avatar';
import EmptyState from '@atlaskit/empty-state';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import {
  ProjectHomeView, VersionFilter, Loading, IssueTable,
} from '..';
import AbsencesTable from './AbsencesTable';
import { GET_ISSUES, useIssues } from '../Issues/Issues';

const GET_RESOURCE_NAME = gql`
  query getResourceById($id: ID!) {
    resource(id: $id) {
      name
    }
  }
`;

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
`;

const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flex: '0 0 200px' }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <VersionFilter />
  </div>
);

function Resource({ navigationViewController, match }) {
  // Extract resource id from url parameters
  const { resourceId } = match.params;
  const issues = useIssues({ query: GET_ISSUES, assignee: match.params.resourceId });

  // Fetch resource from database
  const { data, loading, error } = useQuery(GET_RESOURCE_NAME, {
    variables: { id: resourceId },
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  if (loading) return <Loading />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  const avatar = (
    <NameWrapper>
      <AvatarWrapper>
        <Avatar
          name={data.resource.name}
          size="large"
          src={`https://${process.env.REACT_APP_HOST}/secure/useravatar?ownerId=${resourceId}`}
        />
      </AvatarWrapper>
      {data.resource.name}
    </NameWrapper>
  );

  const link = (
    <p>
      <a
        href={`https://${process.env.REACT_APP_HOST}/issues/?jql=assignee=${resourceId}\
        AND statusCategory != Done order by priority desc`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View in Issue Navigator
      </a>
    </p>
  );

  return (
    <>
      <PageHeader bottomBar={barContent}>
        {avatar}
      </PageHeader>
      {link}
      <IssueTable {...issues} />
      <AbsencesTable resourceId={resourceId} />
    </>
  );
}

Resource.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
  match: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Resource);
