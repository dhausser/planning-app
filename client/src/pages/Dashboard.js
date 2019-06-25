import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { Grid, GridColumn } from '@atlaskit/page';
import EmptyState from '@atlaskit/empty-state';
import {
  ProductHomeView,
  Page,
  Header,
  Loading,
  BarChart,
} from '../components';
import { GET_DASHBOARD_ISSUES } from '../queries';

import { useIssues } from './Issues';

function Dashboard({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProductHomeView.id);
  }, [navigationViewController]);

  const [issues, filters] = useIssues(GET_DASHBOARD_ISSUES);
  const { data, loading, error } = issues;

  if (loading) return <Loading />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Page>
      <Header title="Dashboard" />
      <Grid>
        <GridColumn>
          <BarChart {...data.issues} team={filters.team} />
        </GridColumn>
      </Grid>
    </Page>
  );
}

Dashboard.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Dashboard);
