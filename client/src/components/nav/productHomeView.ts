import { JiraWordmark } from '@atlaskit/logo';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import LinkItem from './LinkItem';

export default {
  id: 'product/home',
  type: 'product',
  getItems: (): Array<object> => [
    {
      type: 'HeaderSection',
      id: 'product/home:header',
      items: [
        {
          type: 'Wordmark',
          wordmark: JiraWordmark,
          id: 'jira-wordmark',
        },
      ],
    },
    {
      type: 'MenuSection',
      nestedGroupKey: 'menu',
      id: 'product/home:menu',
      parentId: null,
      items: [
        // {
        //   type: 'InlineComponent',
        //   component: LinkItem,
        //   id: 'project',
        //   before: FolderIcon,
        //   text: 'Projects',
        //   to: '/',
        // },
        // {
        //   type: 'InlineComponent',
        //   component: LinkItem,
        //   id: 'dashboards',
        //   before: DashboardIcon,
        //   text: 'Dashboards',
        //   to: '/dashboards',
        // },
        // {
        //   type: 'Item',
        //   id: 'issues-and-filters',
        //   goTo: 'product/issues',
        //   before: IssuesIcon,
        //   text: 'Issues and filters',
        // },
        // {
        //   type: 'InlineComponent',
        //   component: LinkItem,
        //   id: 'settings',
        //   before: SettingsIcon,
        //   text: 'Jira settings',
        //   to: '/settings',
        // },
      ],
    },
  ],
};
