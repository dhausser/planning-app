import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import Page from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import { ProjectHomeView } from '.';

function Reports({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  return (
    <Page>
      <PageHeader>Reports</PageHeader>
      <p>This is the Reports page.</p>
    </Page>
  );
}

Reports.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Reports);