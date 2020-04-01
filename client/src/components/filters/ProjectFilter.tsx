import React, { FunctionComponent } from 'react';
import { ApolloClient, gql } from '@apollo/client';
import { OptionType } from '@atlaskit/select';
import Filter from './Filter';

const GET_PROJECTS = gql`
  {
    projectId @client
    projects {
      id
      name
    }
  }
`;

export const updateFilter = (client: ApolloClient<object>, e: OptionType): void => {
  const value = e ? e.value : null;
  client.writeQuery({
    query: gql`
      {
        projectId
        versionId
        statusId
        teamId
      }
    `,
    data: {
      projectId: value,
      versionId: null,
      statusId: null,
      teamId: null,
    },
  });
  if (value) {
    localStorage.setItem('projectId', value as string);
  } else {
    localStorage.removeItem('projectId');
  }
  localStorage.removeItem('versionId');
  localStorage.removeItem('statusId');
  localStorage.removeItem('teamId');
};

const ProjectFilter: FunctionComponent = () => (
  <Filter
    query={GET_PROJECTS}
    updateFilter={updateFilter}
    valueName="projectId"
    valuesName="projects"
    placeholder="Select project"
    isClearable={false}
  />
);

export default ProjectFilter;
