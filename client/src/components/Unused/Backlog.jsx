import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Page from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { ProjectHomeView } from '..';

function Backlog({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  return (
    <Page>
      <PageHeader>Backlog</PageHeader>
      <p>This is the Backlog page.</p>
    </Page>
  );
}

Backlog.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Backlog);
