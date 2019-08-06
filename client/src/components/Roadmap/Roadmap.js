import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import EmptyState from '@atlaskit/empty-state';
import { ProjectHomeView, Loading } from '..';
import { ProjectFilter, VersionFilter } from '../Filters';
import EpicTable from './EpicTable';

const GET_ISSUES = gql`
  query issueList($projectId: String, $versionId: String) {
    filter @client {
      project {
        id @export(as: "projectId")
      }
      version {
        id @export(as: "versionId")
      }
    }
    epics(projectId: $projectId, versionId: $versionId) {
      id
      key
      fields {
        summary
      }
    }
  }
`;

const barContent = (
  <div style={{ display: 'flex' }}>
    <ProjectFilter />
    <VersionFilter />
  </div>
);

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => { }}>
    <BreadcrumbsItem text="Projects" key="Projects" />
    <BreadcrumbsItem text="Gwent" key="Gwent" />
  </BreadcrumbsStateless>
);


function Portfolio({ navigationViewController }) {
  const { data, loading, error } = useQuery(GET_ISSUES);

  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} bottomBar={barContent}>Roadmap</PageHeader>
      {loading ? <Loading /> : <EpicTable {...data} />}
      {error && <EmptyState header={error.name} description={error.message} />}
    </>
  );
}

Portfolio.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Portfolio);
