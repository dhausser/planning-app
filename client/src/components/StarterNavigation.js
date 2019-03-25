import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import Nav, {
  AkContainerTitle,
  AkCreateDrawer,
  AkNavigationItem,
  AkSearchDrawer,
} from '@atlaskit/navigation';
import RoadmapIcon from '@atlaskit/icon/glyph/roadmap';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import GraphBarIcon from '@atlaskit/icon/glyph/graph-bar';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import GearIcon from '@atlaskit/icon/glyph/settings';
import SearchIcon from '@atlaskit/icon/glyph/search';
import CreateIcon from '@atlaskit/icon/glyph/add';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import ArrowleftIcon from '@atlaskit/icon/glyph/arrow-left';
// import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
// import BoardIcon from '@atlaskit/icon/glyph/board';
// import ShipIcon from '@atlaskit/icon/glyph/ship';
// import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';

import CreateDrawer from './CreateDrawer';
import SearchDrawer from './SearchDrawer';
import HelpDropdownMenu from './HelpDropdownMenu';
import AccountDropdownMenu from './AccountDropdownMenu';
import Logo from '../images/viewavatar.svg';

export default class StarterNavigation extends React.Component {
  state = {
    navLinks: [
      ['/roadmap', 'Roadmap', RoadmapIcon],
      ['/issues', 'Backlog', BacklogIcon],
      ['/', 'Reports', GraphBarIcon],
      ['/resources', 'People', PeopleIcon],
      ['/absences', 'Calendar', CalendarIcon],
      ['/settings', 'Settings', GearIcon],
    ],
  };

  static contextTypes = {
    navOpenState: PropTypes.object,
    router: PropTypes.object,
  };

  shouldComponentUpdate(nextProps, nextContext) {
    return true;
  }

  openDrawer = openDrawer => {
    this.setState({ openDrawer });
  };

  render() {
    const backIcon = <ArrowleftIcon label="Back icon" size="medium" />;
    const globalPrimaryIcon = (
      <AtlassianIcon label="Atlassian icon" size="xlarge" />
    );

    return (
      <Nav
        isOpen={this.context.navOpenState.isOpen}
        width={this.context.navOpenState.width}
        onResize={this.props.onNavResize}
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
            isOpen={this.state.openDrawer === 'search'}
            key="search"
            onBackButton={() => this.openDrawer(null)}
            primaryIcon={globalPrimaryIcon}
          >
            <SearchDrawer
              onResultClicked={() => this.openDrawer(null)}
              onSearchInputRef={ref => {
                this.searchInputRef = ref;
              }}
            />
          </AkSearchDrawer>,
          <AkCreateDrawer
            backIcon={backIcon}
            isOpen={this.state.openDrawer === 'create'}
            key="create"
            onBackButton={() => this.openDrawer(null)}
            primaryIcon={globalPrimaryIcon}
          >
            <CreateDrawer onItemClicked={() => this.openDrawer(null)} />
          </AkCreateDrawer>,
        ]}
        globalAccountItem={AccountDropdownMenu}
        globalCreateIcon={<CreateIcon label="Create icon" />}
        globalHelpItem={HelpDropdownMenu}
        onSearchDrawerOpen={() => this.openDrawer('search')}
        onCreateDrawerOpen={() => this.openDrawer('create')}
      >
        {this.state.navLinks.map(link => {
          const [url, title, Icon] = link;
          return (
            <Link key={url} to={url}>
              <AkNavigationItem
                icon={<Icon label={title} size="medium" />}
                text={title}
                isSelected={this.context.router.isActive(url, true)}
              />
            </Link>
          );
        }, this)}
      </Nav>
    );
  }
}
