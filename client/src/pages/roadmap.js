import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import Page from '@atlaskit/page';
import { projectHomeView, ProjectFilter, VersionFilter } from '../components';
import Timeline from '../components/timeline';

const Padding = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 0px 40px;
  box-sizing: border-box; 
  height: 100vh;
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
  useEffect(() => navigationViewController.setView(projectHomeView.id), [navigationViewController]);

  return (
    <Page>
      <Padding>
        <PageHeader breadcrumbs={breadcrumbs} bottomBar={barContent}>Roadmap</PageHeader>
        <Timeline />
      </Padding>
    </Page>
  );
}

Roadmap.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Roadmap);
