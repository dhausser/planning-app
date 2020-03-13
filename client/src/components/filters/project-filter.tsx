import React from 'react';
import { gql } from '@apollo/client';
import Filter from './filter';

const GET_PROJECTS = gql`{
  projectId @client
  projects {
    id
    name
  }
}
`;

export default () => {
  const params = {
    optionName: 'projects',
    setValue: 'projectId',
    resetValue: 'versionId',
  };
  return (
    <Filter
      query={GET_PROJECTS}
      params={params}
      isClearable={false}
    />
  );
};
