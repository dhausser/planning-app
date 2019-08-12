import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import { ProjectHomeView, Layout } from '.';

function Pages({ navigationViewController }) {
  useEffect(() => navigationViewController.setView(ProjectHomeView.id), [navigationViewController]);

  return (
    <Layout>
      <PageHeader>Pages</PageHeader>
      <p>This is the Pages page.</p>
    </Layout>
  );
}

Pages.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Pages);