import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';

const GET_TEAMS = gql`
  query GetTeams {
    teams {
      id
    }
  }
`;

const GET_FILTER = gql`
  query GetFilter {
    filter @client {
      team {
        id
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
  const { data: { filter: { team } } } = useQuery(GET_FILTER);
  const { data: { teams }, loading } = useQuery(GET_TEAMS);
  const [toggleFilter] = useMutation(TOGGLE_FILTER);

  return (
    <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
      <Select
        spacing="compact"
        className="single-select"
        classNamePrefix="react-select"
        defaultValue={team && { value: team.id, label: team.id }}
        isDisabled={false}
        isLoading={loading}
        isClearable
        isSearchable
        options={teams && teams.map(({ id }) => ({
          value: id,
          label: id,
        }))}
        placeholder="Choose a Team"
        onChange={e => toggleFilter({ variables: { ...e, __typename: 'Team' } })}
      />
    </div>
  );
}

export default TeamFilter;
