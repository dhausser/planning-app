import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import EmptyState from '@atlaskit/empty-state';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import { Status } from '@atlaskit/status';
import {
  projectHomeView,
  Loading,
  Layout,
  ProjectFilter,
  VersionFilter,
  StatusFilter,
  IssueTable,
  Nameplate,
} from '../components';

// const GET_ISSUES = gql`
//   query GetIssues(
//     $projectId: String,
//     $versionId: String,
//     $statusId: String,
//     $resourceId: String,
//     $startAt: Int,
//     $maxResults: Int)
//   {
//     projectId @client @export(as: "projectId")
//     versionId @client @export(as: "versionId")
//     statusId @client @export(as: "statusId")
//     issues(
//       projectId: $projectId,
//       versionId: $versionId,
//       statusId: $statusId,
//       resourceId: $resourceId,
//       startAt: $startAt,
//       maxResults: $maxResults)
//     {
//       ...IssuePagination
//       issues {
//         ...IssueRow
//       }
//     }
//   }
//   ${ISSUE_PAGINATION}
//   ${ISSUE_ROW_DATA}
// `;

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


function Absences({ id }) {
  const { loading, error, data } = useQuery(GET_ABSENCES, { variables: { id } });

  if (loading || !data) return <Loading />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  return <>{data.absences.map(({ date }) => <Status key={date} text={date} color="blue" />)}</>;
}

function Resource({ navigationViewController, resourceId }) {
  useEffect(() => {
    navigationViewController.setView(projectHomeView.id);
  }, [navigationViewController]);

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>
        <Nameplate id={resourceId} />
      </PageHeader>
      <IssueTable resourceId={resourceId} />
      <Absences id={resourceId} />
    </Layout>
  );
}

Absences.propTypes = {
  id: PropTypes.string.isRequired,
};

Resource.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
  resourceId: PropTypes.string.isRequired,
};

export default withNavigationViewController(Resource);
