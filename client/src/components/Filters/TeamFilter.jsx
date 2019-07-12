import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';

const GET_TEAMS = gql`
  query GetTeams {
    teams {
      _id
    }
  }
`;

const GET_VISIBILITY_FILTER = gql`
  query GetVisibilityFilter {
    visibilityFilter @client {
      team @client {
        id
        name
      }
    }
  }
`;

const TOGGLE_FILTER = gql`
  mutation toggleFilter($value: ID!, $label: String!, $__typename: String!) {
    toggleFilter(value: $value, label: $label, __typename: $__typename) @client
  }
`;

function TeamFilter() {
  const { data: { visibilityFilter: { team } } } = useQuery(GET_VISIBILITY_FILTER);
  const { data: { teams }, loading, error } = useQuery(GET_TEAMS);
  const [toggleFilter] = useMutation(TOGGLE_FILTER);

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
        onChange={e => toggleFilter({ variables: { ...e, __typename: 'Team' } })}
      />
    </div>
  );
}

export default TeamFilter;
