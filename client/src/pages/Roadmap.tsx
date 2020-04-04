import React, { useEffect, FunctionComponent } from 'react';
import styled from 'styled-components';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import Page from '@atlaskit/page';
import { projectHomeView, ProjectFilter, VersionFilter } from '../components';
import Timeline from '../components/Timeline';
import { Props } from '../types';

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
  <BreadcrumbsStateless>
    <BreadcrumbsItem text="Projects" key="Projects" />
    <BreadcrumbsItem text="Gwent" key="Gwent" />
  </BreadcrumbsStateless>
);

const Roadmap: FunctionComponent<Props> = ({ navigationViewController }) => {
  useEffect(() => navigationViewController.setView(projectHomeView.id), [
    navigationViewController,
  ]);

  return (
    <Page>
      <Padding>
        <PageHeader breadcrumbs={breadcrumbs} bottomBar={barContent}>
          Roadmap
        </PageHeader>
        <Timeline />
      </Padding>
    </Page>
  );
};

export default withNavigationViewController(Roadmap);
