import React, { Component } from 'react';
// import DropdownMenu, { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
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

const teams = (resources) => [...new Set(resources.map(resource => resource.team))];

export default class ResourcesPage extends Component {
  state = {
    showLoadingState: false,
    team: null,
  };

  handleClick(team, e) {
    console.log(e);
    if (this.state.team === team) {
      this.setState({ team: null })
    } else {
      this.setState({ team });
    }
  };

  render() {
    const { showLoadingState, team } = this.state;
    const { resources } = this.props;

    return (
      <ContentWrapper>
        <PageTitle>Resources</PageTitle>
        <ButtonGroup>
          {teams(resources).map(team => (
            <Button
              key={team}
              isLoading={showLoadingState}
              appearance={appearances[0]}
              isSelected={false}
              onClick={(e) => this.handleClick(team, e)}
            >
              {team}
            </Button>
          ))}
        </ButtonGroup>
        {/* <DropdownMenu
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
        </DropdownMenu> */}
        {/* <ResourceList {...this.props} /> */}
        {team ? (
          <ResourceList resources={resources.filter(resource => resource.team === team)} />
        ) : (
          <ResourceList resources={resources} />
        )}
      </ContentWrapper>
    );
  }
}
