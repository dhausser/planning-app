import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';

const GET_TEAM = gql`
  query GetFilters {
    team @client {
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

const TOGGLE_TEAM = gql`
  mutation toggleTeam($team: Team!) {
    toggleTeam(team: $team) @client
  }
`;

function TeamFilter() {
  const { data: { team } } = useQuery(GET_TEAM);
  const { data: { teams }, loading, error } = useQuery(GET_TEAMS);
  const toggleTeam = useMutation(TOGGLE_TEAM);

  let options = [];
  if (!loading && !error) {
    options = teams && teams.map(({ _id: id }) => ({
      value: id,
      label: id,
    }));
  }

  return (
    <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
      <Select
        spacing="compact"
        className="single-select"
        classNamePrefix="react-select"
        defaultValue={team && { value: team.id, label: team.name }}
        isDisabled={false}
        isLoading={loading}
        isClearable
        isSearchable
        options={options}
        placeholder="Choose a Team"
        onChange={e => toggleTeam({ variables: { team: e } })}
      />
    </div>
  );
}

export default TeamFilter;
