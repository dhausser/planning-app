import React from 'react';
import { useApolloClient, useQuery, gql } from '@apollo/client';
import Select from '@atlaskit/select';
import EmptyState from '@atlaskit/empty-state';
import { Wrapper } from './ProjectFilter';

export const GET_TEAMS = gql`
  query GetTeams {
    teamId @client
    teams {
      id
    }
  }
`;

export default () => {
  const client = useApolloClient();
  const { loading, error, data } = useQuery(GET_TEAMS);
  let defaultValue;

  if (error) return <EmptyState header={error.name} description={error.message} />;

  const options = data.teams && data.teams.map(({ id }) => {
    const option = { value: id, label: id };
    if (id === data.teamId) defaultValue = option;
    return option;
  });

  return (
    <Wrapper>
      <Select
        className="single-select"
        classNamePrefix="react-select"
        spacing="compact"
        isClearable
        value={defaultValue}
        isLoading={loading}
        options={options}
        placeholder="Choose a Team"
        onChange={(e) => client.writeQuery({
          query: gql`{ teamId }`,
          data: { teamId: e && e.value },
        })}
      />
    </Wrapper>
  );
};
