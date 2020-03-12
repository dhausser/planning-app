import React from 'react';
import { gql } from '@apollo/client';
import Filter from './filter';

export const GET_TEAMS = gql`
  query GetTeams {
    teamId @client
    teams {
      id
    }
  }
`;

export default () => (
  <Filter
    query={GET_TEAMS}
    itemName="teams"
    setValue="teamId"
    resetValue=""
    isClearable
  />
);
