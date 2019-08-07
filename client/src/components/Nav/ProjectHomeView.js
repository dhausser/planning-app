import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import RoadmapIcon from '@atlaskit/icon/glyph/roadmap';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import ShipIcon from '@atlaskit/icon/glyph/ship';
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
          before: ShipIcon,
          text: 'Releases',
          to: '/releases',
          id: 'releases',
        },
        // {
        //   type: 'InlineComponent',
        //   component: LinkItem,
        //   before: IssuesIcon,
        //   text: 'Issues and filters',
        //   to: '/issues',
        //   id: 'issues-and-filters',
        // },
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
          before: GraphLineIcon,
          text: 'Reports',
          to: '/reports',
          id: 'reports',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: PeopleIcon,
          text: 'People',
          to: '/resources',
          id: 'resources',
        },
      ],
    },
  ],
};
