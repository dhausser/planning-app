import React, { useEffect } from 'react';

import { useQuery, gql } from '@apollo/client';


import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withNavigationViewController } from '@atlaskit/navigation-next';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import Page from '@atlaskit/page';

import {
  ProjectHomeView,
  Loading,
  Error,
  ProjectFilter,
  VersionFilter,
  Timeline,
} from '../components';

const Padding = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 0px 40px;
  box-sizing: border-box; 
  height: 100vh;
`;

const GET_ISSUES = gql`
  query issueList($projectId: String, $versionId: String) {
    projectId @client @export(as: "projectId")
    versionId @client @export(as: "versionId")
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

function Roadmap({ navigationViewController }) {
  useEffect(() => navigationViewController.setView(ProjectHomeView.id), [navigationViewController]);
  const { loading, error, data } = useQuery(GET_ISSUES);

  if (error) return <Error error={error.name} message={error.message} />;

  return (
    <Page>
      <Padding>
        <PageHeader breadcrumbs={breadcrumbs} bottomBar={barContent}>Roadmap</PageHeader>
        {loading ? <Loading /> : <Timeline epics={data.epics} />}
      </Padding>
    </Page>
  );
}

Roadmap.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Roadmap);
