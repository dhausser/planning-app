import React, { useState, useEffect, useContext } from 'react'
import Button, { ButtonGroup } from '@atlaskit/button'
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu'
import config from '../credentials.json'
import { FilterContext } from '../context/FilterContext'

export default function Filters() {
  const [isLoading, setIsLoading] = useState(true)
  const { teams, fixVersions } = useData(setIsLoading)
  const { teamFilter, setTeamFilter, fixVersion, setFixVersion } = useContext(
    FilterContext
  )

  if (isLoading)
    return (
      <Button key="team" isLoading={isLoading} appearance="subtle">
        Teams
      </Button>
    )
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
            isSelected={teamName === teamFilter}
            onClick={() =>
              setTeamFilter(teamFilter !== teamName ? teamName : '')
            }
          >
            {teamName}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  )
}

function useData(setIsLoading) {
  const [teams, setTeams] = useState([])
  const [fixVersions, setFixVersions] = useState([])
  useEffect(() => {
    let ignore = false
    fetchData(setTeams, setFixVersions, ignore, setIsLoading)
    return () => {
      ignore = true
    }
  }, [setIsLoading])
  return { teams, fixVersions }
}

async function fetchData(setTeams, setFixVersions, ignore, setIsLoading) {
  const { Authorization, projectId } = config
  const [teamPromise, fixVersionPromise] = await Promise.all([
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization,
      },
      body: JSON.stringify({
        query: `
      {
        teams {
          _id
          size
          members {
            key
          }
        }
      }`,
      }),
    }),
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization,
      },
      body: JSON.stringify({
        query: `
      {
        versions(id: ${projectId}, pageSize: 5, after: 0) {
          id
          name
          description
        }
      }`,
      }),
    }),
  ])
  const [teamsResponse, versionsResponse] = await Promise.all([
    teamPromise.json(),
    fixVersionPromise.json(),
  ])

  if (!ignore) {
    setTeams(teamsResponse.data.teams.map(({ _id }) => _id))
    setFixVersions(versionsResponse.data.versions)
    setIsLoading(false)
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
