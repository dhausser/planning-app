import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import PageHeader from '@atlaskit/page-header';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { projectHomeView, Layout } from '../components';

function Releases({ navigationViewController }) {
  useEffect(() => navigationViewController.setView(projectHomeView.id), [
    navigationViewController,
  ]);

  return (
    <Layout>
      <PageHeader>Releases</PageHeader>
      <p>This is the releases page.</p>
    </Layout>
  );
}

Releases.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Releases);
