import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import { ProjectHomeView, Layout } from '.';

function Board({ navigationViewController }) {
  useEffect(() => navigationViewController.setView(ProjectHomeView.id), [navigationViewController]);

  return (
    <Layout>
      <PageHeader>Board</PageHeader>
      <p>This is the Board page.</p>
    </Layout>
  );
}

Board.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Board);
