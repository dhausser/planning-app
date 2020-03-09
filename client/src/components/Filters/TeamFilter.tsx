import * as React from 'react';
import { ApolloClient, gql } from '@apollo/client';
import Filter from './Filter';

export const GET_TEAMS = gql`
  query GetTeams {
    teamId @client
    teams {
      id
    }
  }
`;

function updateCache(client: ApolloClient<object >, value: string | null) {
  client.writeQuery({
    query: gql`{ teamId }`,
    data: { teamId: value },
  });
}

export default () => (
  <Filter
    updateCache={updateCache}
    query={GET_TEAMS}
    items="teams"
    itemId="teamId"
    isClearable
  />
);
