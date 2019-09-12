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
  StatusFilter,
  IssueTable,
  LoadButton,
} from '../components';
import { ISSUE_ROW_DATA, ISSUE_PAGINATION } from './Issues';

const GET_ASSIGNEE = gql`
  query GetAssignee($id: ID!) {
    user(id: $id) {
      displayName
      avatarUrls {
        small
      }
    }
  }
`;

const ROWS_PER_PAGE = 50;

const GET_ISSUES = gql`
  query GetIssues($projectId: String, $versionId: String, $statusId: String, $resourceId: String, $startAt: Int, $maxResults: Int) {
    projectId @client @export(as: "projectId")
    versionId @client @export(as: "versionId")
    statusId @client @export(as: "statusId")
    issues(projectId: $projectId, versionId: $versionId, statusId: $statusId, resourceId: $resourceId, startAt: $startAt, maxResults: $maxResults) {
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
    <StatusFilter />
  </div>
);

function Resource({ navigationViewController, match }) {
  const [length, setLength] = useState(0);
  const { resourceId } = match.params;

  const {
    loading: loadingAssignee,
    error: errorAssignee,
    data: dataAssignee,
  } = useQuery(GET_ASSIGNEE, {
    variables: { id: resourceId },
  });

  const {
    loading: loadingIssues,
    error: errorIssues,
    data: dataIssues,
    fetchMore,
  } = useQuery(GET_ISSUES, {
    variables: { resourceId, maxResults: ROWS_PER_PAGE },
  });

  const {
    loading: loadingAbsences,
    error: errorAbsences,
    data: dataAbsences,
  } = useQuery(GET_ABSENCES, {
    variables: { id: resourceId },
  });

  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
    if (dataIssues && dataIssues.issues && dataIssues.issues.issues.length) {
      setLength(dataIssues.issues.issues.length);
    }
  }, [navigationViewController, dataIssues]);

  if (errorAssignee) {
    return (
      <EmptyState
        name={errorAssignee.name}
        message={errorAssignee.message}
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
        {loadingAssignee
          ? <Loading />
          : (
            <NameWrapper>
              <AvatarWrapper>
                <Avatar
                  name={dataAssignee && dataAssignee.user.displayName}
                  size="large"
                  src={`https://${process.env.REACT_APP_HOST}/secure/useravatar?ownerId=${resourceId}`}
                />
              </AvatarWrapper>
              {dataAssignee && dataAssignee.user.displayName}
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
        issues={dataIssues && dataIssues.issues}
        rowsPerPage={ROWS_PER_PAGE + length}
        startAt={length}
      />
      {dataIssues && dataIssues.issues
        && dataIssues.issues.total > length
        && <LoadButton fetchMore={fetchMore} startAt={length} />}
      {loadingAbsences
        ? <Loading />
        : dataAbsences && dataAbsences.absences.map(({ date }) => <Status key={date} text={date} color="blue" />)}
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
