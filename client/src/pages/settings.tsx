import React, { useEffect, FunctionComponent } from 'react';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import { projectHomeView, Layout } from '../components';
import { Props } from './types';

const Settings: FunctionComponent<Props> = ({ navigationViewController }) => {
  useEffect(() => navigationViewController.setView(projectHomeView.id), [
    navigationViewController,
  ]);

  return (
    <Layout>
      <PageHeader>Settings</PageHeader>
      <p>This is the Settings page.</p>
    </Layout>
  );
};

export default withNavigationViewController(Settings);
