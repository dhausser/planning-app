import React, { useEffect, FunctionComponent } from 'react';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import {
  productIssuesView,
  Layout,
  ProjectFilter,
  VersionFilter,
  StatusFilter,
  TeamFilter,
  IssueTable,
} from '../components';
import { Props } from '../types';

const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flexBasis: 150, marginRight: 8 }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <ProjectFilter />
    {/* <VersionFilter /> */}
    {/* <StatusFilter />
    <TeamFilter /> */}
  </div>
);

const Issues: FunctionComponent<Props> = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(productIssuesView.id);
  }, [navigationViewController]);

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>Search Issues</PageHeader>
      <IssueTable />
    </Layout>
  );
};

export default withNavigationViewController(Issues);
