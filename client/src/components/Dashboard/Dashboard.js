import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { Grid } from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import TextField from '@atlaskit/textfield';
import EmptyState from '@atlaskit/empty-state';

import { ProductHomeView, Loading, Layout } from '..';
import { ProjectFilter, VersionFilter, TeamFilter } from '../Filters';
import BarChart from './BarChart';

const GET_ISSUES = gql`
  query GetDashboardIssues($projectId: String, $versionId: String, $teamId: String, $startAt: Int, $maxResults: Int) {
    filter @client {
      project {
        id @export(as: "projectId")
      }
      version {
        id @export(as: "versionId")
      }
      team {
        id @export(as: "teamId")
      }
    }
    dashboardIssues(projectId: $projectId, versionId: $versionId, teamId: $teamId, startAt: $startAt, maxResults: $maxResults) {
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

function Dashboard({ navigationViewController }) {
  const { data, loading, error } = useQuery(GET_ISSUES);

  useEffect(() => {
    navigationViewController.setView(ProductHomeView.id);
  }, [navigationViewController]);

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>Dashboard</PageHeader>
      {error
        ? <EmptyState header={error.name} description={error.message} />
        : (
          <div style={{ display: 'block' }}>
            <Grid>
              {(loading || !data)
                ? <Loading />
                : <BarChart {...data} />
              }
            </Grid>
          </div>
        )
      }
    </Layout>
  );
}

Dashboard.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Dashboard);
