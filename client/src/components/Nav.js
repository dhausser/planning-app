import React from 'react'
import { Link, Route } from 'react-router-dom'
import GlobalNavigation from '@atlaskit/global-navigation'
import { ItemAvatar } from '@atlaskit/navigation-next'
import { JiraIcon, JiraWordmark } from '@atlaskit/logo'
import BacklogIcon from '@atlaskit/icon/glyph/backlog'
import BoardIcon from '@atlaskit/icon/glyph/board'
import ComponentIcon from '@atlaskit/icon/glyph/component'
import DashboardIcon from '@atlaskit/icon/glyph/dashboard'
import FolderIcon from '@atlaskit/icon/glyph/folder'
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line'
import IssueIcon from '@atlaskit/icon/glyph/issue'
import PageIcon from '@atlaskit/icon/glyph/page'
import PortfolioIcon from '@atlaskit/icon/glyph/portfolio'
import ShipIcon from '@atlaskit/icon/glyph/ship'
import RoadmapIcon from '@atlaskit/icon/glyph/roadmap'
import PeopleIcon from '@atlaskit/icon/glyph/people'
import { hostname } from 'os'

import { hostname as baseURL, projectId } from '../credentials'

export const MyGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={() => <JiraIcon size="medium" />}
    onProductClick={() => {}}
  />
)

const LinkItem = ({ components: { Item }, to, ...props }) => (
  <Route
    render={({ location: { pathname } }) => (
      <Item
        component={({ children, className }) => (
          <Link className={className} to={to}>
            {children}
          </Link>
        )}
        isSelected={pathname === to}
        {...props}
      />
    )}
  />
)

export const productHomeView = {
  id: 'product/home',
  type: 'product',
  getItems: () => [
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
        {
          type: 'InlineComponent',
          component: LinkItem,
          id: 'dashboards',
          before: DashboardIcon,
          text: 'Dashboards',
          to: '/',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          id: 'people',
          before: FolderIcon,
          text: 'People',
          to: '/resources',
        },
        {
          type: 'Item',
          id: 'issues-and-filters',
          goTo: 'product/issues',
          before: IssueIcon,
          text: 'Issues and filters',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          id: 'portfolio',
          before: PortfolioIcon,
          text: 'Portfolio',
          to: '/portfolio',
        },
      ],
    },
  ],
}

export const productIssuesView = {
  id: 'product/issues',
  type: 'product',
  getItems: () => [
    {
      type: 'HeaderSection',
      id: 'product/issues:header',
      items: [
        {
          type: 'Wordmark',
          wordmark: JiraWordmark,
          id: 'jira-wordmark',
        },
        {
          type: 'BackItem',
          id: 'back-item',
          goTo: 'project/home',
          text: 'Back to Project',
        },
      ],
    },
    {
      type: 'MenuSection',
      nestedGroupKey: 'menu',
      id: 'product/issues:menu',
      parentId: 'product/home:menu',
      alwaysShowScrollHint: true,
      items: [
        {
          type: 'SectionHeading',
          text: 'Issues and filters',
          id: 'issues-and-filters-heading',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          id: 'search-issues',
          text: 'Search issues',
          to: '/issues',
        },
        { type: 'GroupHeading', id: 'other-heading', text: 'Other' },
        {
          type: 'InlineComponent',
          component: LinkItem,
          text: 'My open issues',
          id: 'my-open-issues',
          to: '/issues/1',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          text: 'Reported by me',
          id: 'reported-by-me',
          to: '/issues/2',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          text: 'All issues',
          id: 'all-issues',
          to: '/issues/3',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          text: 'Open issues',
          id: 'open-issues',
          to: '/issues/4',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          text: 'Done issues',
          id: 'done-issues',
          to: '/issues/5',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          text: 'Viewed recently',
          id: 'viewed-recently',
          to: '/issues/6',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          text: 'Created recently',
          id: 'created-recently',
          to: '/issues/7',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          text: 'Resolved recently',
          id: 'resolved-recently',
          to: '/issues/8',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          text: 'Updated recently',
          id: 'updated-recently',
          to: '/issues/9',
        },
        { type: 'Separator', id: 'separator' },
        {
          type: 'InlineComponent',
          component: LinkItem,
          text: 'View all filters',
          id: 'view-all-filters',
          to: '/issues/10',
        },
      ],
    },
  ],
}

export const projectHomeView = {
  id: 'project/home',
  type: 'container',
  getItems: () => [
    {
      type: 'HeaderSection',
      id: 'project/home:header',
      items: [
        {
          type: 'ContainerHeader',
          before: itemState => (
            <ItemAvatar
              itemState={itemState}
              appearance="square"
              size="large"
              src={`https://${baseURL}/secure/projectavatar?pid=${projectId}`}
            />
          ),
          text: 'Space Invader',
          subText: 'Software project',
          id: 'project-header',
        },
      ],
    },
    {
      type: 'MenuSection',
      nestedGroupKey: 'menu',
      id: 'project/home:menu',
      parentId: null,
      items: [
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: PortfolioIcon,
          text: 'Porfolio',
          to: '/portfolio',
          id: 'portfolio',
        },
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
          before: PeopleIcon,
          text: 'People',
          to: '/resources',
          id: 'resources',
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
          text: 'Active sprints',
          to: '/sprints',
          id: 'active-sprints',
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
          before: ShipIcon,
          text: 'Releases',
          to: '/releases',
          id: 'releases',
        },
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: IssueIcon,
          text: 'Issues and filters',
          to: '/issues',
          id: 'issues-and-filters',
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
          before: ComponentIcon,
          text: 'Components',
          to: '/components',
          id: 'components',
        },
      ],
    },
  ],
}
