import React, { Component } from 'react';
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

export default class TeamFilter extends Component {
  state = {
    isSelected: false,
  };

  handleClick = (team) => {
    this.setState({ isSelected: !this.state.isSelected });
    this.props.updateFilter(team)
  }

  render() {
    const { isLoading, teams, filter } = this.props;
    return (
      <ButtonGroup>
        {isLoading ? (
          <Button
            key={'team'}
            isLoading={isLoading}
            appearance={appearances[0]}
          >
            Team
          </Button>
        ) : (
          teams.map(team => (
            <Button
              key={team}
              isLoading={isLoading}
              appearance={appearances[0]}
              isSelected={filter === team}
              onClick={(e) => this.handleClick(team, e)}
            >
              {team}
            </Button>
          ))
        )}
      </ButtonGroup>
    );
  }
}
