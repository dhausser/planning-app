import RoadmapIcon from '@atlaskit/icon/glyph/roadmap';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import PageIcon from '@atlaskit/icon/glyph/page';
import AddItemIcon from '@atlaskit/icon/glyph/add-item';
import PersonCircleIcon from '@atlaskit/icon/glyph/person-circle';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import Switcher from './Switcher';
import LinkItem from './LinkItem';

export default {
  id: 'project/home',
  type: 'container',
  getItems: () => [
    {
      type: 'HeaderSection',
      id: 'project/home:header',
      items: [
        {
          type: 'ContainerHeader',
          component: Switcher,
          id: 'switcher',
        },
      ],
    },
    {
      type: 'MenuSection',
      nestedGroupKey: 'menu',
      id: 'project/home:menu',
      parentId: 'product/home:menu',
      items: [
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: RoadmapIcon,
          text: 'Roadmap',
          to: '/roadmap',
          id: 'roadmap',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: BacklogIcon,
          text: 'Backlog',
          to: '/backlog',
          id: 'backlog',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: BoardIcon,
          text: 'Board',
          to: '/board',
          id: 'board',
        },
        {
          type: 'Item',
          id: 'issues-and-filters',
          goTo: 'product/issues',
          before: IssuesIcon,
          text: 'Issues and filters',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: ShipIcon,
          text: 'Releases',
          to: '/releases',
          id: 'releases',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: PersonCircleIcon,
          text: 'Teams',
          to: '/resources',
          id: 'resources',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: GraphLineIcon,
          text: 'Reports',
          to: '/reports',
          id: 'reports',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: PageIcon,
          text: 'Pages',
          to: '/pages',
          id: 'pages',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: AddItemIcon,
          text: 'Add item',
          to: '/addItem',
          id: 'addItem',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: SettingsIcon,
          text: 'Project settings',
          to: '/settings',
          id: 'settings',
        },
      ],
    },
  ],
};
