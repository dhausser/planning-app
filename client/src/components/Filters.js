import React, { useState, useEffect } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import { fetchFixVersions } from '../modules/Helpers';

/**
 * TODO: Reinstate Localstorage
 */
// const team = localStorage.getItem('team')
//   ? JSON.parse(localStorage.getItem('team'))
//   : null;
// const fixVersion = localStorage.getItem('fixVersion')
//   ? JSON.parse(localStorage.getItem('fixVersion'))
//   : fixVersions.values[0];

export default function Filters() {
  const [teams, setTeams] = useState([]);
  const [fixVersions, setFixVersions] = useState([]);
  const [fixVersion, setFixVersion] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchTeams() {
      const res = await fetch('/api/teams');
      const data = await res.json();
      if (!ignore) setTeams(data);
    }

    fetchTeams();
    fetchFixVersions(setFixVersions, ignore, setIsLoading);
    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading)
    return (
      <Button key="team" isLoading={isLoading} appearance="subtle">
        Teams
      </Button>
    );
  return (
    <div style={{ margin: '20px' }}>
      <ButtonGroup>
        <DropdownMenu
          isLoading={isLoading}
          trigger={`FixVersion: ${fixVersion && fixVersion.name}`}
          triggerType="button"
          shouldFlip={false}
          position="right top"
        >
          <DropdownItemGroup>
            {fixVersions.map(version => (
              <DropdownItem
                key={version.id}
                onClick={() => setFixVersion(version)}
              >
                {version.name}
              </DropdownItem>
            ))}
          </DropdownItemGroup>
        </DropdownMenu>
        {teams.map(team => (
          <Button
            key={team}
            isLoading={isLoading}
            appearance="subtle"
            // isSelected={team === this.context.team}
            // onClick={() => updateFilter({ team })}
          >
            {team}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}
