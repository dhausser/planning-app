import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';

export default class TeamFilter extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    teams: PropTypes.array,
    team: PropTypes.string,
    fixVersions: PropTypes.array,
    fixVersion: PropTypes.object,
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
            trigger={fixVersion.name}
            triggerType="button"
            shouldFlip={false}
            position="right top"
          >
            <DropdownItemGroup>
              {fixVersions.map(version => (
                <DropdownItem
                  key={version.id}
                  onClick={() => {
                    updateFilter({ fixVersion: version });
                  }}
                >
                  {version.name}
                </DropdownItem>
              ))}
            </DropdownItemGroup>
          </DropdownMenu>
          {isLoading ? (
            <Button key="team" isLoading={isLoading} appearance="subtle">
              Teams
            </Button>
          ) : (
            teams.map(team => (
              <Button
                key={team}
                isLoading={isLoading}
                appearance="subtle"
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
