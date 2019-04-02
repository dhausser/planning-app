import React, { useState, useEffect } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import config from '../modules/credentials.json';

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
  const [fixVersion, setFixVersion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { teams, fixVersions } = useData(setIsLoading);
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
            {fixVersions &&
              fixVersions.map(version => (
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

function useData(setIsLoading) {
  const [teams, setTeams] = useState([]);
  const [fixVersions, setFixVersions] = useState([]);
  useEffect(() => {
    let ignore = false;
    fetchTeams(setTeams, ignore);
    fetchFixVersions(setFixVersions, ignore, setIsLoading);
    return () => {
      ignore = true;
    };
  }, [setIsLoading]);
  return { teams, fixVersions };
}

async function fetchTeams(setTeams, ignore) {
  const res = await fetch('/api/teams');
  const data = await res.json();
  if (!ignore) setTeams(data);
}

async function fetchFixVersions(setData, ignore, setIsLoading) {
  const { Authorization } = config;
  const resource = `/project/10500/version?startAt=59&maxResults=5&orderBy=+releaseDate&status=unreleased`;

  const response = await fetch('/api/fixVersions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Authorization, resource }),
  });
  const data = await response.json();
  if (!ignore) {
    setData(data.values);
    setIsLoading(false);
  }
}
