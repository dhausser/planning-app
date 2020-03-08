import React, { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import Page from '@atlaskit/page';
import { ProjectHomeView, ProjectFilter, VersionFilter, Timeline } from '../components';

const Padding = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 0px 40px;
  box-sizing: border-box; 
  height: 100vh;
`;

const barContent = (client) => (
  <div style={{ display: 'flex' }}>
    <ProjectFilter client={client} />
    <VersionFilter client={client} />
  </div>
);

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => { }}>
    <BreadcrumbsItem text="Projects" key="Projects" />
    <BreadcrumbsItem text="Gwent" key="Gwent" />
  </BreadcrumbsStateless>
);

function Roadmap({ navigationViewController }) {
  const client = useApolloClient();

  useEffect(() => navigationViewController.setView(ProjectHomeView.id), [navigationViewController]);

  return (
    <Page>
      <Padding>
        <PageHeader breadcrumbs={breadcrumbs} bottomBar={barContent(client)}>Roadmap</PageHeader>
        <Timeline />
      </Padding>
    </Page>
  );
}

Roadmap.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Roadmap);
