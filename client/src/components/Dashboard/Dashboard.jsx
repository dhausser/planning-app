import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import EmptyState from '@atlaskit/empty-state';
import { ProductHomeView, Loading } from '..';
import BarChart from './BarChart';
import { GET_DASHBOARD_ISSUES } from '../../queries';

import { useIssues } from '../Issues/Issues';

function Dashboard({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProductHomeView.id);
  }, [navigationViewController]);

  const [issues, filters] = useIssues(GET_DASHBOARD_ISSUES);
  const { data, loading, error } = issues;
  let content;

  if (loading) {
    content = <Loading />;
  } else if (error) {
    content = <EmptyState header={error.name} description={error.message} />;
  } else {
    content = <BarChart {...data.issues} team={filters.team} />;
  }

  return (
    <Page>
      <PageHeader>Dashboard</PageHeader>
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
