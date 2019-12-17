import React, { useState, useEffect } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import PropTypes from 'prop-types';

import { withNavigationViewController } from '@atlaskit/navigation-next';
import EmptyState from '@atlaskit/empty-state';
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
  Nameplate,
} from '../components';
import { ISSUE_ROW_DATA, ISSUE_PAGINATION } from './Issues';

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

function Issues({ resourceId }) {
  const [length, setLength] = useState(0);
  const {
    loading, error, data, fetchMore,
  } = useQuery(GET_ISSUES, {
    variables: { resourceId, maxResults: ROWS_PER_PAGE },
  });

  useEffect(() => {
    if (data && data.issues && data.issues.issues.length) {
      setLength(data.issues.issues.length);
    }
  }, [data]);

  return (
    <>
      <IssueTable
        loading={loading}
        error={error}
        issues={data && data.issues}
        rowsPerPage={ROWS_PER_PAGE + length}
        startAt={length}
      />
      {data
        && data.issues
        && data.issues.total > length
        && <LoadButton fetchMore={fetchMore} startAt={length} />}
    </>
  );
}

function Absences({ id }) {
  const { loading, error, data } = useQuery(GET_ABSENCES, { variables: { id } });

  if (error) return <EmptyState name={error.name} message={error.message} />;
  if (loading || !data) return <Loading />;

  return <>{data.absences.map(({ date }) => <Status key={date} text={date} color="blue" />)}</>;
}

function Resource({ navigationViewController, match }) {
  const { resourceId } = match.params;

  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>
        <Nameplate id={resourceId} />
      </PageHeader>
      <Issues resourceId={resourceId} />
      <Absences id={resourceId} />
    </Layout>
  );
}

Issues.propTypes = {
  resourceId: PropTypes.string.isRequired,
};

Absences.propTypes = {
  id: PropTypes.string.isRequired,
};

Resource.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
  match: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Resource);
