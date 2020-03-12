import React from 'react';
import { gql } from '@apollo/client';
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

export default () => (
  <Filter
    query={GET_VERSIONS}
    itemName="versions"
    setValue="versionId"
    resetValue="statusId"
    isClearable
  />
);
