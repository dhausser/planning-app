import * as React from 'react';
import { ApolloClient, gql } from '@apollo/client';
import Filter from './Filter';

const GET_STATUSES = gql`
  query ($id: ID!) {
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

function updateCache(client: ApolloClient<object >, value: string | null) {
  client.writeQuery({
    query: gql`{ statusId }`,
    data: { statusId: value },
  });
}

export default () => (
  <Filter
    updateCache={updateCache}
    query={GET_STATUSES}
    items="statuses"
    itemId="statusId"
    isClearable
  />
);
