import React, { FunctionComponent } from 'react';
import { ApolloClient, gql } from '@apollo/client';
import { OptionType } from '@atlaskit/select';
import { GET_TEAMS } from '../../lib/useTeams';
import Filter from './Filter';

const updateFilter = (client: ApolloClient<object>, e: OptionType): void => {
  const value = e ? e.value : null;
  client.writeQuery({
    query: gql`
      {
        teamId
      }
    `,
    data: {
      teamId: value,
    },
  });
  if (value) {
    localStorage.setItem('teamId', value as string);
  } else {
    localStorage.removeItem('teamId');
  }
};

const TeamFilter: FunctionComponent = () => (
  <Filter
    query={GET_TEAMS}
    updateFilter={updateFilter}
    valueName="teamId"
    valuesName="teams"
    placeholder="Select team"
    isClearable
  />
);

export default TeamFilter;
