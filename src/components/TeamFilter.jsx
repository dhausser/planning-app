import React, { Component } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
// import DropdownMenu, { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';

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

// <ButtonGroup>
// {isLoading ? (
//   <Button
//     key={'team'}
//     isLoading={isLoading}
//     appearance={appearances[0]}
//     isSelected={this.state.isSelected}
//     onClick={(e) => this.handleClick(team, e)}
//   >
//     Team
// </Button>
// ) : (
//     getTeams(resources).map(team => (
//       <Button
//         key={team}
//         isLoading={isLoading}
//         appearance={appearances[0]}
//         isSelected={this.state.team === team}
//         onClick={(e) => this.handleClick(team, e)}
//       >
//         {team}
//       </Button>
//     ))
//   )}
// </ButtonGroup>

// <DropdownMenu
// trigger="Team"
// triggerType="button"
// shouldFlip={false}
// position="right top"
// onOpenChange={e => console.log('dropdown opened', e)}

// >
// <DropdownItemGroup>
//   {teams.map(team => (
//     <DropdownItem
//       key={team}
//       onClick={(e) => this.handleClick(team, e)}
//       onItemActivated={e => console.log(e)}
//     >
//       {team}
//     </DropdownItem>
//   ))}
// </DropdownItemGroup>
// </DropdownMenu>