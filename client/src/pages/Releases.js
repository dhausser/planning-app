import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { ProjectHomeView, Page, Header } from '../components';

function Releases({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  return (
    <Page>
      <Header title="Releases" />
      <p>This is the releases page.</p>
    </Page>
  );
}

Releases.propTypes = {
  navigationViewController: PropTypes.func.isRequired,
};

export default withNavigationViewController(Releases);
