import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-apollo-hooks';
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
  const [data, setData] = useState({
    team: null, teams: null, loading: false, error: null,
  });
  const toggleTeam = useMutation(TOGGLE_TEAM);

  useEffect(() => {
    function fetchData() {
      const { data: { team } } = useQuery(GET_TEAM);
      const { data: { teams }, loading, error } = useQuery(GET_TEAMS);
      setData({
        team, teams, loading, error,
      });
    }

    fetchData();
  }, []);

  let options = [];
  if (!data.loading && !data.error) {
    options = data.teams && data.teams.map(({ _id: id }) => ({
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
        defaultValue={data.team && { value: data.team.id, label: data.team.name }}
        isDisabled={false}
        isLoading={data.loading}
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
