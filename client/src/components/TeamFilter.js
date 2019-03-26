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
    team: PropTypes.string,
    fixVersions: PropTypes.array,
    fixVersion: PropTypes.string,
    updateFilter: PropTypes.func,
  };

  render() {
    const {
      isLoading,
      teams,
      fixVersions,
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
                isSelected={team === this.context.team}
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
