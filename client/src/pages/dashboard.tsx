import React, { useEffect, FunctionComponent, ReactNode } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid } from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import { withNavigationViewController, NavigationViewController } from '@atlaskit/navigation-next';
import TextField from '@atlaskit/textfield';
import EmptyState from '@atlaskit/empty-state';
import styled from 'styled-components';

import { Props } from './types';

import {
  projectHomeView,
  Layout,
  Loading,
  ProjectFilter,
  VersionFilter,
  TeamFilter,
  BarChart,
} from '../components';

const GET_ISSUES = gql`
  query GetDashboardIssues(
    $projectId: String
    $versionId: String
    $teamId: String
    $startAt: Int
    $maxResults: Int
  ) {
    projectId @client @export(as: "projectId")
    versionId @client @export(as: "versionId")
    teamId @client @export(as: "teamId")
    dashboardIssues(
      projectId: $projectId
      versionId: $versionId
      teamId: $teamId
      startAt: $startAt
      maxResults: $maxResults
    ) {
      maxResults
      total
      labels
      values
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
    <TeamFilter />
  </div>
);

const Wrapper: FunctionComponent = ({ children }) => (
  <Layout>
    <PageHeader bottomBar={barContent}>Dashboard</PageHeader>
    {children}
  </Layout>
);

const Block = styled.div`
  display: block;
`;

const Dashboard: FunctionComponent<Props> = ({ navigationViewController }) => {
  const { error, loading, data } = useQuery(GET_ISSUES, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => navigationViewController.setView(projectHomeView.id), [
    navigationViewController,
  ]);

  if (loading) {
    return (
      <Wrapper>
        <Loading />
      </Wrapper>
    );
  }
  if (error) {
    return (
      <Wrapper>
        <EmptyState header={error.name} description={error.message} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Block>
        <Grid>
          {data.dashboardIssues && data.dashboardIssues && (
            <BarChart
              labels={data.dashboardIssues.labels}
              values={data.dashboardIssues.values}
              maxResults={data.dashboardIssues.maxResults}
              total={data.dashboardIssues.total}
            />
          )}
        </Grid>
      </Block>
    </Wrapper>
  );
}

export default withNavigationViewController(Dashboard);
