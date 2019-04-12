import React, { useState, useEffect, useContext } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import config from '../credentials.json';
import { FilterContext } from '../context/FilterContext';

export default function Filters() {
  const { team, setTeam, fixVersion, setFixVersion } = useContext(
    FilterContext
  );
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
        {teams.map(teamName => (
          <Button
            key={teamName}
            isLoading={isLoading}
            appearance="subtle"
            isSelected={teamName === team}
            onClick={e =>
              setTeam(team !== e.target.innerHTML ? e.target.innerHTML : '')
            }
          >
            {teamName}
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
    fetchData(setTeams, setFixVersions, ignore, setIsLoading);
    return () => {
      ignore = true;
    };
  }, [setIsLoading]);
  return { teams, fixVersions };
}

async function fetchData(setTeams, setFixVersions, ignore, setIsLoading) {
  const { Authorization } = config;
  const resource = `/project/10500/version?startAt=59&maxResults=5&orderBy=+releaseDate&status=unreleased`;
  const [teamPromise, fixVersionPromise] = await Promise.all([
    fetch('/api/teams'),
    fetch('/api/fixVersions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Authorization, resource }),
    }),
  ]);
  const [teams, fixVersions] = await Promise.all([
    teamPromise.json(),
    fixVersionPromise.json(),
  ]);
  if (!ignore) {
    setTeams(teams);
    setFixVersions(fixVersions.values);
    setIsLoading(false);
  }
}

//   // Reinstate localstorage
//   const team = localStorage.getItem('team')
//     ? JSON.parse(localStorage.getItem('team'))
//     : null;
//   const fixVersion = localStorage.getItem('fixVersion')
//     ? JSON.parse(localStorage.getItem('fixVersion'))
//     : fixVersions.values[0];

//   // Fetch Jira issues
//   const { issues, maxResults, total } = await fetchIssues('');

//   // Update State
// }

/**
 * TODO: Reinstate Localstorage
 */
// const team = localStorage.getItem('team')
//   ? JSON.parse(localStorage.getItem('team'))
//   : null;
// const fixVersion = localStorage.getItem('fixVersion')
//   ? JSON.parse(localStorage.getItem('fixVersion'))
//   : fixVersions.values[0];
