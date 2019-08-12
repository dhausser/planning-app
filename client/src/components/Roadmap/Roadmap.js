import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';

import { withNavigationViewController } from '@atlaskit/navigation-next';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import Page from '@atlaskit/page';

import { ProjectHomeView, Loading, Error } from '..';
import { ProjectFilter, VersionFilter } from '../Filters';
import Timeline from './Timeline';

const Padding = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 0px 40px;
  box-sizing: border-box; 
  height: 100vh;
`;

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

function Roadmap({ navigationViewController }) {
  useEffect(() => navigationViewController.setView(ProjectHomeView.id), [navigationViewController]);
  const { data, loading, error } = useQuery(GET_ISSUES);

  if (error) return <Error {...error} />;

  return (
    <Page>
      <Padding>
        <PageHeader breadcrumbs={breadcrumbs} bottomBar={barContent}>Roadmap</PageHeader>
        {loading ? <Loading /> : <Timeline {...data} />}
      </Padding>
    </Page>
  );
}

Roadmap.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Roadmap);
