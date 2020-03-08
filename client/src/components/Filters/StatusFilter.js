import React from 'react';
import { useApolloClient, gql } from '@apollo/client';
import Filter from './Filter';

const GET_STATUSES = gql`
  query ($id: ID!) {
    projectId @client @export(as: "id")
    statusId @client
    statuses(id: $id) {
      id
      name
    }
  }
`;

export default function StatusFilter() {
  const client = useApolloClient();
  const handleChange = (e) => client.writeQuery({
    query: gql`{ statusId }`,
    data: { statusId: e && e.value },
  });

  return (
    <Filter
      handleChange={handleChange}
      query={GET_STATUSES}
      items="statuses"
      itemId="statusId"
    />
  );
}
