import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
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

export default function StatusFilter({ client }) {
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

StatusFilter.propTypes = {
  client: PropTypes.func.isRequired,
};
