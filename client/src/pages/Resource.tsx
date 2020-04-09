import React, { useEffect, FunctionComponent, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
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
import { ResourceProps, Absence } from '../types';

/**
 * TODO: Refactor GetIssues query
 */
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

// const GET_ABSENCES = gql`
//   query getAbsences($id: ID!) {
//     absences(id: $id) {
//       key
//       date
//     }
//   }
// `;

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

// function Absences({ id }: { id?: string }): ReactElement {
//   const { loading, error, data } = useQuery(GET_ABSENCES, {
//     variables: { id },
//   });

//   if (loading) return <Loading />;
//   if (error)
//     return <EmptyState header={error.name} description={error.message} />;

//   return (
//     <>
//       <h1>Absences</h1>
//       {data.absences.map(({ date }: Absence) => (
//         <Status key={date} text={date} color="blue" />
//       ))}
//     </>
//   );
// }

function Resource({ navigationViewController }: ResourceProps): ReactElement {
  const { id } = useParams();

  useEffect(() => {
    navigationViewController.setView(projectHomeView.id);
  }, [navigationViewController]);

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>
        <Nameplate id={id as string} />
      </PageHeader>
      <IssueTable resourceId={id} />
      {/* <Absences id={id} /> */}
    </Layout>
  );
}

export default withNavigationViewController(Resource);
