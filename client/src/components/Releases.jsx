import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Page from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { ProjectHomeView } from '.';

function Releases({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  return (
    <Page>
      <PageHeader>Releases</PageHeader>
      <p>This is the releases page.</p>
    </Page>
  );
}

Releases.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Releases);
