import React from 'react';
import { gql } from '@apollo/client';
import Filter from './filter';

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

export default () => (
  <Filter
    query={GET_STATUSES}
    itemName="statuses"
    setValue="statusId"
    resetValue=""
    isClearable
  />
);
