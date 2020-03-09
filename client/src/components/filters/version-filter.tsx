import * as React from 'react';
import { ApolloClient, gql } from '@apollo/client';
import Filter from './filter';

const GET_VERSIONS = gql`
  query ($id: ID!) {
    projectId @client @export(as: "id")
    versionId @client
    versions(id: $id) {
      id
      name
    }
  }
`;

function updateCache(client: ApolloClient<object >, value: string | null) {
  client.writeQuery({
    query: gql`{
      versionId
      statusId
    }`,
    data: {
      versionId: value,
      statusId: null,
    },
  });
}

export default () => (
  <Filter
    updateCache={updateCache}
    query={GET_VERSIONS}
    items="versions"
    itemId="versionId"
    isClearable
  />
);
