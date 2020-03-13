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

export default () => {
  const params = {
    optionName: 'statuses',
    setValue: 'statusId',
    resetValue: '',
  };
  return (
    <Filter
      query={GET_STATUSES}
      params={params}
      isClearable
    />
  );
};
