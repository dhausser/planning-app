import PropTypes from 'prop-types';
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
  static contextTypes = {
    isLoading: PropTypes.bool,
    teams: PropTypes.array,
    filter: PropTypes.string,
    updateFilter: PropTypes.func,
  };

  render() {
    const { teams, isLoading, filter, updateFilter  } = this.context;

    return (
      <ButtonGroup>
        {isLoading ? (
          <Button
            key={'team'}
            isLoading={isLoading}
            appearance={appearances[0]}
          >
          Teams
          </Button>
        ) : (
          teams.map(team => (
            <Button
              key={team}
              isLoading={isLoading}
              appearance={appearances[0]}
              isSelected={filter === team}
              onClick={() => updateFilter(team)}
            >
              {team}
            </Button>
          ))
        )}
      </ButtonGroup>
    );
  }
}
