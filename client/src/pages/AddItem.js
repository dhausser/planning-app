import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import { ProjectHomeView, Layout } from '../components';

function AddItem({ navigationViewController }) {
  useEffect(() => navigationViewController.setView(ProjectHomeView.id), [navigationViewController]);

  return (
    <Layout>
      <PageHeader>AddItem</PageHeader>
      <p>This is the AddItem page.</p>
    </Layout>
  );
}

AddItem.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(AddItem);
