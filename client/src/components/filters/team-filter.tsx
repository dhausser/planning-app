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

export default () => {
  const params = {
    optionName: 'teams',
    setValue: 'teamId',
    resetValue: '',
  };
  return (
    <Filter
      query={GET_TEAMS}
      params={params}
      isClearable
    />
  );
};
