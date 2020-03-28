import React from 'react';
import { ApolloClient, gql } from '@apollo/client';
import { OptionType } from '@atlaskit/select';
import Filter from './filter';

const GET_STATUSES = gql`
  query($id: ID!) {
    projectId @client @export(as: "id")
    statusId @client
    statuses(id: $id) {
      id
      name
      statusCategory {
        id
        key
        colorName
        name
      }
    }
  }
`;

const updateFilter = (client: ApolloClient<object>, e: OptionType) => {
  const value = e ? e.value : null;
  client.writeQuery({
    query: gql`
      {
        statusId
      }
    `,
    data: {
      statusId: value,
    },
  });
  if (value) {
    localStorage.setItem('statusId', value as string);
  } else {
    localStorage.removeItem('statusId');
  }
};

export default () => (
  <Filter
    query={GET_STATUSES}
    updateFilter={updateFilter}
    valueName="statusId"
    valuesName="statuses"
    placeholder="Select status"
    isClearable
  />
);
