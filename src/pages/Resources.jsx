import React, { Component } from 'react';
// import DropdownMenu, { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
import ResourceList from '../components/ResourceList';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import Button, { ButtonGroup } from '@atlaskit/button';
import { throws } from 'assert';

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
    isSelected: false,
    team: null,
  };

  componentDidMount() {
    this.setState({ resources: this.props.resources })
  }

  handleClick(team, e) {
    if (this.state.team === team) {
      this.setState({ team: null, isSelected: !this.state.isSelected })
    } else {
      this.setState({ team, isSelected: !this.state.isSelected });
    }
  };

  render() {
    const { resources, isLoading } = this.props;
    const { team } = this.state;

    return (
      <ContentWrapper>
        <PageTitle>Resources</PageTitle>
        <ButtonGroup>
          {isLoading ? (
            <Button
              key={'team'}
              isLoading={isLoading}
              appearance={appearances[0]}
              isSelected={this.state.isSelected}
              onClick={(e) => this.handleClick(team, e)}
            >
              Team
        </Button>
          ) : (
              teams(resources).map(team => (
                <Button
                  key={team}
                  isLoading={isLoading}
                  appearance={appearances[0]}
                  isSelected={this.state.team === team}
                  onClick={(e) => this.handleClick(team, e)}
                >
                  {team}
                </Button>
              ))
            )}
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
          <ResourceList resources={resources.filter(resource => resource.team === this.state.team)} isLoading={isLoading} />
        ) : (
            <ResourceList resources={resources} isLoading={isLoading} />
          )}
      </ContentWrapper>
    );
  }
}
