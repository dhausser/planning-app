import React from 'react';
import { useQuery, useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';

import { GET_PROJECTS } from '../../queries';

const GET_PROJECT = gql`
  query GetFilters {
    project @client {
      id
      name
    }
  }
`;

const TOGGLE_PROJECT = gql`
  mutation toggleProject($project: Project!) {
    toggleProject(project: $project) @client
  }
`;

function ProjectFilter() {
  const { data: { project } } = useQuery(GET_PROJECT);
  const { data, loading, error } = useQuery(GET_PROJECTS);
  const toggleProject = useMutation(TOGGLE_PROJECT);

  let options = [];
  if (!error) {
    options = data.projects && data.projects.map(option => ({
      value: option.id,
      label: option.name,
    }));
  } else {
    console.error(error);
  }

  return (
    <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
      <Select
        spacing="compact"
        className="single-select"
        classNamePrefix="react-select"
        defaultValue={project && { value: project.id, label: project.name }}
        isDisabled={false}
        isLoading={loading}
        isClearable
        isSearchable
        options={options}
        placeholder="Choose a project"
        onChange={e => toggleProject({ variables: { project: e } })}
      />
    </div>
  );
}

export default ProjectFilter;
