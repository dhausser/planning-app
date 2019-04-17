import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
// import { __RouterContext } from 'react-router';

import Nav, {
  AkContainerTitle,
  AkCreateDrawer,
  AkNavigationItem,
  AkSearchDrawer,
} from '@atlaskit/navigation'
import DashboardIcon from '@atlaskit/icon/glyph/dashboard'
import RoadmapIcon from '@atlaskit/icon/glyph/roadmap'
import IssuesIcon from '@atlaskit/icon/glyph/issues'
import PeopleIcon from '@atlaskit/icon/glyph/people'
import CalendarIcon from '@atlaskit/icon/glyph/calendar'
import SearchIcon from '@atlaskit/icon/glyph/search'
import CreateIcon from '@atlaskit/icon/glyph/add'
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian'
import ArrowleftIcon from '@atlaskit/icon/glyph/arrow-left'
// import GraphBarIcon from '@atlaskit/icon/glyph/graph-bar';
// import BacklogIcon from '@atlaskit/icon/glyph/backlog';
// import BoardIcon from '@atlaskit/icon/glyph/board';
// import ShipIcon from '@atlaskit/icon/glyph/ship';
// import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
// import GearIcon from '@atlaskit/icon/glyph/settings';

import CreateDrawer from './CreateDrawer'
import SearchDrawer from './SearchDrawer'
import HelpDropdownMenu from './HelpDropdownMenu'
import AccountDropdownMenu from './AccountDropdownMenu'
import Logo from '../images/viewavatar.png'
import { NavContext } from '../context/NavContext'

export default function StarterNavigation() {
  const { navOpenState, onNavResize } = useContext(NavContext)
  // const router = useContext(__RouterContext);
  const [state, setState] = useState({
    navLinks: [
      ['/', 'Dashboard', DashboardIcon],
      ['/roadmap', 'Roadmap', RoadmapIcon],
      ['/issues', 'Issues', IssuesIcon],
      ['/resources', 'People', PeopleIcon],
      ['/absences', 'Calendar', CalendarIcon],
    ],
  })

  function openDrawer(drawer) {
    setState({ openDrawer: drawer })
  }

  const backIcon = <ArrowleftIcon label="Back icon" size="medium" />
  const globalPrimaryIcon = (
    <AtlassianIcon label="Atlassian icon" size="xlarge" />
  )

  return (
    <Nav
      isOpen={navOpenState.isOpen}
      width={navOpenState.width}
      onResize={onNavResize}
      containerHeaderComponent={() => (
        <AkContainerTitle
          href="/"
          icon={<img alt="logo" src={Logo} />}
          text="Space Gwent"
        />
      )}
      globalPrimaryIcon={globalPrimaryIcon}
      globalPrimaryItemHref="/"
      globalSearchIcon={<SearchIcon label="Search icon" />}
      hasBlanket
      drawers={[
        <AkSearchDrawer
          backIcon={backIcon}
          isOpen={state.openDrawer === 'search'}
          key="search"
          onBackButton={() => openDrawer(null)}
          primaryIcon={globalPrimaryIcon}
        >
          <SearchDrawer
            onResultClicked={() => openDrawer(null)}
            // onSearchInputRef={ref => {
            //   this.searchInputRef = ref;
            // }}
          />
        </AkSearchDrawer>,
        <AkCreateDrawer
          backIcon={backIcon}
          isOpen={state.openDrawer === 'create'}
          key="create"
          onBackButton={() => openDrawer(null)}
          primaryIcon={globalPrimaryIcon}
        >
          <CreateDrawer onItemClicked={() => openDrawer(null)} />
        </AkCreateDrawer>,
      ]}
      globalAccountItem={AccountDropdownMenu}
      globalCreateIcon={<CreateIcon label="Create icon" />}
      globalHelpItem={HelpDropdownMenu}
      onSearchDrawerOpen={() => openDrawer('search')}
      onCreateDrawerOpen={() => openDrawer('create')}
    >
      {state.navLinks.map(link => {
        const [url, title, Icon] = link
        return (
          <Link key={url} to={url}>
            <AkNavigationItem
              icon={<Icon label={title} size="medium" />}
              text={title}
              // isSelected={router.isActive(url, true)}
            />
          </Link>
        )
      }, this)}
    </Nav>
  )
}
