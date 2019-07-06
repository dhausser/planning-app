import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
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
import { GET_DASHBOARD_ISSUES } from '../../queries';

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
  const { data, loading, error } = useIssues(GET_DASHBOARD_ISSUES);
  let content;

  useEffect(() => {
    navigationViewController.setView(ProductHomeView.id);
  }, [navigationViewController]);

  if (loading) {
    content = <Loading />;
  } else if (error) {
    content = <EmptyState header={error.name} description={error.message} />;
  } else {
    content = <BarChart {...data.issues} />;
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
