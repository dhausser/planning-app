import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';

import { withNavigationViewController } from '@atlaskit/navigation-next';
import Avatar from '@atlaskit/avatar';
import EmptyState from '@atlaskit/empty-state';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import { ProjectHomeView, Loading, Layout } from '..';
import { ProjectFilter, VersionFilter } from '../Filters';
import IssueTable from '../Issues/IssueTable';
import AbsencesList from './AbsencesList';
// import AbsencesTable from './AbsencesTable';
import { ISSUE_ROW_DATA, ISSUE_PAGINATION } from '../Issues/Issues';

/**
 * TODO: Get User from REST API
 */
// const GET_USER = gql`
//   query GetUser($id: ID!) {
//     user(id: $id) {
//       avatarUrls {
//         small
//       }
//     }
//   }
// `;

const GET_ISSUES = gql`
  query GetIssues($projectId: String, $versionId: String, $resourceId: String, $startAt: Int, $maxResults: Int) {
    filter @client {
      project {
        id @export(as: "projectId")
      }
      version {
        id @export(as: "versionId")
      }
    }
    issues(projectId: $projectId, versionId: $versionId, resourceId: $resourceId, startAt: $startAt, maxResults: $maxResults) {
      ...IssuePagination
      issues {
        ...IssueRow
      }
    }
  }
  ${ISSUE_PAGINATION}
  ${ISSUE_ROW_DATA}
`;

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
    <div style={{ flexBasis: 150, marginRight: 8 }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <ProjectFilter />
    <VersionFilter />
  </div>
);

function Resource({ navigationViewController, match }) {
  useEffect(() => navigationViewController.setView(ProjectHomeView.id), [navigationViewController]);
  const { resourceId } = match.params;
  const issues = useQuery(GET_ISSUES, { variables: { resourceId } });

  const { data, loading, error } = useQuery(GET_RESOURCE_NAME, {
    variables: { id: resourceId },
    fetchPolicy: 'cache-first',
  });

  if (loading) return <Loading />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>
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
      </PageHeader>
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
      <IssueTable {...issues} />
      <AbsencesList resourceId={resourceId} />
      {/* <AbsencesTable resourceId={resourceId} /> */}
    </Layout>
  );
}

Resource.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
  match: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Resource);
