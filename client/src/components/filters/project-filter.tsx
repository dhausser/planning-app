import * as React from 'react';
import { ApolloClient, gql } from '@apollo/client';
import Filter from './filter';

const GET_PROJECTS = gql`{
  projectId @client
  projects {
    id
    name
  }
}
`;

function updateCache(client: ApolloClient<object >, value: string | null) {
  client.writeQuery({
    query: gql`{
      projectId
      versionId
    }`,
    data: {
      projectId: value,
      versionId: null,
    },
  });
}

export default () => (
  <Filter
    updateCache={updateCache}
    query={GET_PROJECTS}
    items="projects"
    itemId="projectId"
    isClearable={false}
  />
);
