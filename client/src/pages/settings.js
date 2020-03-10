import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import { projectHomeView, Layout } from '../components';

function Settings({ navigationViewController }) {
  useEffect(() => navigationViewController.setView(projectHomeView.id), [navigationViewController]);

  return (
    <Layout>
      <PageHeader>Settings</PageHeader>
      <p>This is the Settings page.</p>
    </Layout>
  );
}

Settings.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Settings);