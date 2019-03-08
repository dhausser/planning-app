import React, { Component } from 'react';
import DropdownMenu, { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
import ResourceList from '../components/ResourceList';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import Button, { ButtonGroup } from '@atlaskit/button';

const appearances = [
  'default',
  'primary',
  'link',
  'subtle',
  'subtle-link',
  'warning',
  'danger',
  'help',
];

const Table = (props) => (
  <div style={{ display: 'table' }} {...props} />
);
const Row = (props) => (
  <div style={{ display: 'table-row' }} {...props} />
);
const Cell = (props) => (
  <div style={{ display: 'table-cell', padding: 4 }} {...props} />
);

export default class ResourcesPage extends Component {
  state = {
    showLoadingState: false,
    team: null,
  };

  handleClick(team) {
    this.setState({ team });
  };

  render() {
    const { showLoadingState, team } = this.state;
    const teams = [...new Set(this.props.resources.map(resource => resource.team))];
    const resources = this.props.resources.filter(resource => resource.team === team);

    return (
      <ContentWrapper>
        <PageTitle>Resources</PageTitle>
        {/* <ButtonGroup>
          {teams.map(team => (
            <Button
              ref={team}
              isLoading={showLoadingState}
              appearance={appearances[1]}
              isSelected={false}
              onClick={(e) => this.handleClick(team, e)}
            >
              {team}
            </Button>
          ))}
        </ButtonGroup> */}
        <DropdownMenu
          trigger="Team"
          triggerType="button"
          shouldFlip={false}
          position="right top"
          onOpenChange={e => console.log('dropdown opened', e)}

        >
          <DropdownItemGroup>
            {teams.map(team => (
              <DropdownItem
                key={team}
                onClick={(e) => this.handleClick(team, e)}
                onItemActivated={e => console.log(e)}
              >
                {team}
              </DropdownItem>
            ))}
          </DropdownItemGroup>
        </DropdownMenu>
        <ResourceList resources={resources} />
        {/* <ResourceList {...this.props} /> */}
      </ContentWrapper>
    );
  }
}
