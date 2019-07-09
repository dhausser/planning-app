import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import TextField from '@atlaskit/textfield';
import EmptyState from '@atlaskit/empty-state';
import BarChart from './BarChart';
import {
  ProductHomeView, ProjectFilter, VersionFilter, TeamFilter, Loading,
} from '..';
import { useIssues } from '../Issues/Issues';

const GET_ISSUES = gql`
  query issueList($jql: String, $startAt: Int, $maxResults: Int) {
    dashboardIssues(jql: $jql, startAt: $startAt, maxResults: $maxResults) {
      maxResults
      total
      issues {
        assignee {
          name
          team
        }
      }
    }
  }
`;

const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flex: '0 0 200px' }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <ProjectFilter />
    <VersionFilter />
    <TeamFilter />
  </div>
);


function Dashboard({ navigationViewController }) {
  const { data, loading, error } = useIssues(GET_ISSUES);
  let content;

  useEffect(() => {
    navigationViewController.setView(ProductHomeView.id);
  }, [navigationViewController]);

  if (loading) {
    content = <Loading />;
  } else if (error) {
    content = <EmptyState header={error.name} description={error.message} />;
  } else {
    content = <BarChart {...data.dashboardIssues} />;
  }

  return (
    <Page>
      <PageHeader bottomBar={barContent}>Dashboard</PageHeader>
      <Grid>
        <GridColumn>
          {content}
        </GridColumn>
      </Grid>
    </Page>
  );
}

Dashboard.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Dashboard);
