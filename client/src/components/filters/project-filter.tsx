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

export default () => (
  <Filter
    query={GET_PROJECTS}
    itemName="projects"
    setValue="projectId"
    resetValue="versionId"
    isClearable={false}
  />
);
