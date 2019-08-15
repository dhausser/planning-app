import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';

import { withNavigationViewController } from '@atlaskit/navigation-next';
import EmptyState from '@atlaskit/empty-state';
import Avatar from '@atlaskit/avatar';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import { Status } from '@atlaskit/status';

import {
  ProjectHomeView,
  Loading,
  Layout,
  ProjectFilter,
  VersionFilter,
  IssueTable,
  LoadButton,
} from '../components';
import { ISSUE_ROW_DATA, ISSUE_PAGINATION } from './Issues';

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

const GET_RESOURCE_NAME = gql`
  query getResourceById($id: ID!) {
    resource(id: $id) {
      name
    }
  }
`;

const ROWS_PER_PAGE = 10;

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

const GET_ABSENCES = gql`
  query getAbsences($id: ID!) {
    absences(id: $id) {
      key
      date
    }
  }
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
  const [startAt, setStartAt] = useState(ROWS_PER_PAGE);
  const { resourceId } = match.params;

  const {
    loading: loadingResource,
    error: errorResource,
    data: { resource },
  } = useQuery(GET_RESOURCE_NAME, {
    variables: { id: resourceId },
  });

  const {
    loading: loadingIssues,
    error: errorIssues,
    data: { issues },
    fetchMore,
  } = useQuery(GET_ISSUES, {
    variables: { resourceId, maxResults: ROWS_PER_PAGE },
  });

  const {
    loading: loadingAbsences,
    error: errorAbsences,
    data: { absences },
  } = useQuery(GET_ABSENCES, {
    variables: { id: resourceId },
  });

  if (errorResource) {
    return (
      <EmptyState
        name={errorResource.name}
        message={errorResource.message}
      />
    );
  }

  if (errorAbsences) {
    return (
      <EmptyState
        name={errorAbsences.name}
        message={errorAbsences.message}
      />
    );
  }

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>
        {loadingResource
          ? <Loading />
          : (
            <NameWrapper>
              <AvatarWrapper>
                <Avatar
                  name={resource.name}
                  size="large"
                  src={`https://${process.env.REACT_APP_HOST}/secure/useravatar?ownerId=${resourceId}`}
                />
              </AvatarWrapper>
              {resource.name}
            </NameWrapper>
          )}
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
      <IssueTable
        loading={loadingIssues}
        error={errorIssues}
        issues={issues}
        rowsPerPage={ROWS_PER_PAGE + startAt}
        startAt={startAt}
      />
      {issues
        && issues.total > startAt
        && (
        <LoadButton
          setStartAt={setStartAt}
          fetchMore={fetchMore}
          startAt={startAt}
          maxResults={issues.maxResults}
        />
        )}
      {loadingAbsences
        ? <Loading />
        : absences && absences.map(({ date }) => <Status text={date} color="blue" />)}
    </Layout>
  );
}

Resource.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
  match: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Resource);

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
`;
