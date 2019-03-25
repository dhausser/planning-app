import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';

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
    fixVersions: PropTypes.array,
    fixVersion: PropTypes.string,
  };

  render() {
    const {
      teams,
      fixVersions,
      isLoading,
      filter,
      fixVersion,
      updateFilter,
    } = this.context;
    return (
      <div style={{ margin: '20px' }}>
        <ButtonGroup>
          <DropdownMenu
            isLoading={isLoading}
            trigger={fixVersion != null ? fixVersion : 'FixVersion'}
            triggerType="button"
            shouldFlip={false}
            position="right top"
          >
            <DropdownItemGroup>
              {fixVersions.map(version => (
                <DropdownItem
                  key={version}
                  onClick={() => {
                    updateFilter({ fixVersion: version });
                  }}
                >
                  {version}
                </DropdownItem>
              ))}
            </DropdownItemGroup>
          </DropdownMenu>
          {isLoading ? (
            <Button
              key="team"
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
                onClick={() => updateFilter({ team })}
              >
                {team}
              </Button>
            ))
          )}
        </ButtonGroup>
      </div>
    );
  }
}
