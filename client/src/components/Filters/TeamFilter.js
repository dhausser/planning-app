import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Filter from './Filter';

export const GET_TEAMS = gql`
  query GetTeams {
    teamId @client
    teams {
      id
    }
  }
`;

export default function TeamFilter({ client }) {
  const handleChange = (e) => client.writeQuery({
    query: gql`{ teamId }`,
    data: { teamId: e && e.value },
  });

  return (
    <Filter
      handleChange={handleChange}
      query={GET_TEAMS}
      items="teams"
      itemId="teamId"
    />
  );
}

TeamFilter.propTypes = {
  client: PropTypes.func.isRequired,
};
