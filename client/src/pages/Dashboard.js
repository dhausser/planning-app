import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { Grid, GridColumn } from '@atlaskit/page';
import {
  ProductHomeView,
  Page,
  Header,
  Loading,
  Error,
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
  if (error) return <Error error={error} />;

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
