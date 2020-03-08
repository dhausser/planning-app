import React from 'react';
import { useApolloClient, gql } from '@apollo/client';
import Filter from './Filter';

export const GET_TEAMS = gql`
  query GetTeams {
    teamId @client
    teams {
      id
    }
  }
`;

export default function TeamFilter() {
  const client = useApolloClient();
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
