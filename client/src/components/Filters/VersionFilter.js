import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Filter from './Filter';

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

export default function VersionFilter({ client }) {
  const handleChange = (e) => client.writeQuery({
    query: gql`{
      versionId
      statusId
    }`,
    data: {
      versionId: e && e.value,
      statusId: null,
    },
  });

  return (
    <Filter
      handleChange={handleChange}
      query={GET_VERSIONS}
      items="versions"
      itemId="versionId"
    />
  );
}

VersionFilter.propTypes = {
  client: PropTypes.func.isRequired,
};
