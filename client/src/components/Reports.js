import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import { ProjectHomeView, Layout } from '.';

function Reports({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  return (
    <Layout>
      <PageHeader>Reports</PageHeader>
      <p>This is the Reports page.</p>
    </Layout>
  );
}

Reports.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Reports);
