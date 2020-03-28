import React, { useEffect, FunctionComponent } from 'react';
import PageHeader from '@atlaskit/page-header';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { projectHomeView, Layout } from '../components';
import { Props } from './types';

const Releases: FunctionComponent<Props> = ({ navigationViewController }) => {
  useEffect(() => navigationViewController.setView(projectHomeView.id), [
    navigationViewController,
  ]);

  return (
    <Layout>
      <PageHeader>Releases</PageHeader>
      <p>This is the releases page.</p>
    </Layout>
  );
};

export default withNavigationViewController(Releases);
