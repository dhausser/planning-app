/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';
import { GET_TEAMS } from '../../queries';

const TOGGLE_TEAM = gql`
  mutation toggleTeam($team: Team!) {
    toggleTeam(team: $team) @client
  }
`;
function TeamFilter({ team }) {
  const { data, loading, error } = useQuery(GET_TEAMS, {
    fetchPolicy: 'cache-first',
  });
  const toggleTeam = useMutation(TOGGLE_TEAM);

  let options = [];
  if (!error) {
    options = data.teams && data.teams.map(option => ({
      value: option._id,
      label: option._id,
    }));
  } else {
    console.error(error);
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

TeamFilter.defaultProps = {
  team: {},
};

TeamFilter.propTypes = {
  team: PropTypes.objectOf(PropTypes.string),
};

export default TeamFilter;
