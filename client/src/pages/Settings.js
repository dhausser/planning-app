import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { ProductHomeView, Page, Header } from '../components';

function Settings({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProductHomeView.id);
  }, [navigationViewController]);

  return (
    <Page>
      <Header title="Settings" />
      <p>This is the Settings page.</p>
    </Page>
  );
}

Settings.propTypes = {
  navigationViewController: PropTypes.func.isRequired,
};

export default withNavigationViewController(Settings);
