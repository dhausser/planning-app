import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// Atlaskit
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { Grid, GridColumn } from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';

// Components
import { ProjectHomeView } from '.';

function Portfolio({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  return (
    <Grid layout="fluid">
      <GridColumn>
        <PageHeader>Roadmap</PageHeader>
        <div draggable="true">
          <p>This paragraph is draggable</p>
        </div>
      </GridColumn>
    </Grid>
  );
}

Portfolio.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Portfolio);
