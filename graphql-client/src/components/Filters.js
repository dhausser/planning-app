import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Button, { ButtonGroup } from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import config from '../credentials.json';
import { FilterContext } from '../context/FilterContext';

const GET_VERSIONS = gql`
  query GetVersions($id: ID!, $pageSize: Int, $after: Int) {
    versions(id: $id, pageSize: $pageSize, after: $after) {
      id
      name
    }
  }
`;

const GET_TEAMS = gql`
  query GetTeams {
    teams {
      _id
    }
  }
`;

export default function Filters() {
  const { teamFilter, setTeamFilter, fixVersion, setFixVersion } = useContext(
    FilterContext
  );

  return (
    <Fragment>
      <ButtonGroup>
        <Query
          query={GET_VERSIONS}
          variables={{ id: 10500, pageSize: 4, after: 4 }}
        >
          {({ data, loading, error }) => {
            if (error) return <p>ERROR</p>;

            return (
              <DropdownMenu
                isLoading={loading}
                trigger={`FixVersion: ${fixVersion && fixVersion.name}`}
                triggerType="button"
                shouldFlip={false}
                position="right top"
              >
                <DropdownItemGroup>
                  {data.versions &&
                    data.versions.map(version => (
                      <DropdownItem
                        key={version.id}
                        onClick={() => setFixVersion(version)}
                      >
                        {version.name}
                      </DropdownItem>
                    ))}
                </DropdownItemGroup>
              </DropdownMenu>
            );
          }}
        </Query>
        <Query query={GET_TEAMS}>
          {({ data, loading, error }) => {
            if (loading)
              return (
                <Button key="team" isLoading={loading} appearance="subtle">
                  Teams
                </Button>
              );
            if (error) return <p>ERROR</p>;

            return data.teams.map(team => (
              <Button
                key={team._id}
                isLoading={loading}
                appearance="subtle"
                isSelected={team._id === teamFilter}
                onClick={() =>
                  setTeamFilter(teamFilter !== team._id ? team._id : null)
                }
              >
                {team._id}
              </Button>
            ));
          }}
        </Query>
      </ButtonGroup>
    </Fragment>
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
//   const {issues, maxResults, total } = await fetchIssues('');

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
