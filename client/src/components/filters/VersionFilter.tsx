import React, { FunctionComponent } from 'react';
import { ApolloClient, gql } from '@apollo/client';
import { OptionType } from '@atlaskit/select';
import Filter from './Filter';

const GET_VERSIONS = gql`
  query($id: ID!) {
    projectId @client @export(as: "id")
    versionId @client
    versions(id: $id) {
      id
      name
    }
  }
`;

const updateFilter = (client: ApolloClient<object>, e: OptionType): void => {
  const value = e ? e.value : null;
  client.writeQuery({
    query: gql`
      {
        versionId
      }
    `,
    data: {
      versionId: value,
    },
  });
  if (value) {
    localStorage.setItem('versionId', value as string);
  } else {
    localStorage.removeItem('versionId');
  }
};

const VersionFilter: FunctionComponent = () => (
  <Filter
    query={GET_VERSIONS}
    updateFilter={updateFilter}
    valueName="versionId"
    valuesName="versions"
    placeholder="Select version"
    isClearable
  />
);

export default VersionFilter;
