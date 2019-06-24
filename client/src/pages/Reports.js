import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { ProjectHomeView, Page, Header } from '../components';

function Reports({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  return (
    <Page>
      <Header title="Reports" />
      <p>This is the Reports page.</p>
    </Page>
  );
}

Reports.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Reports);
