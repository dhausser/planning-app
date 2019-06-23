import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { ProjectHomeView, Page, Header } from '../components';

function Backlog({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  return (
    <Page>
      <Header title="Backlog" />
      <p>This is the Backlog page.</p>
    </Page>
  );
}

Backlog.propTypes = {
  navigationViewController: PropTypes.func.isRequired,
};

export default withNavigationViewController(Backlog);
