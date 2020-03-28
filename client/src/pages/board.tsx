import React, { useEffect, FunctionComponent } from 'react';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';

import { projectHomeView, Layout } from '../components';
import { Props } from './types';

const Board: FunctionComponent<Props> = ({ navigationViewController }) => {
  useEffect(() => navigationViewController.setView(projectHomeView.id), [
    navigationViewController,
  ]);

  return (
    <Layout>
      <PageHeader>Board</PageHeader>
      <p>This is the Board page.</p>
    </Layout>
  );
}

export default withNavigationViewController(Board);
