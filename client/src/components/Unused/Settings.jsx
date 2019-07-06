import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Page from '@atlaskit/page';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import { ProductHomeView } from '..';

function Settings({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProductHomeView.id);
  }, [navigationViewController]);

  return (
    <Page>
      <PageHeader>Settings</PageHeader>
      <p>This is the Settings page.</p>
    </Page>
  );
}

Settings.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Settings);
