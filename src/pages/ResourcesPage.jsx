import React, { Component } from 'react';
import DropdownMenu, { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
import ResourceList from '../components/ResourceList';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';

export default class ResourcesPage extends Component {
  state = {
    team: null
  };
  
  render() {
    console.log(this.props);
    const teams = [...new Set(this.props.resources.map(resource => resource.team))];
    console.log(teams);
    return (
      <ContentWrapper>
        <PageTitle>Resources</PageTitle>
        <DropdownMenu
          trigger="Team"
          triggerType="button"
          shouldFlip={false}
          position="right top"
          onOpenChange={e => console.log('dropdown opened', e)}
          onClick={e => console.log(e)}
          onItemActivated={e => console.log(e)}
        >
          <DropdownItemGroup>
            {teams.map(team => <DropdownItem key={team}>{team}</DropdownItem>)}
          </DropdownItemGroup>
        </DropdownMenu>
        <ResourceList {...this.props} />
      </ContentWrapper>
    );
  }
}
