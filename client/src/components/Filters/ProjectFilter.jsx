import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';

const GET_PROJECT = gql`
  query GetFilters {
    project @client {
      id
      name
    }
  }
`;

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
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
  const { data: { projects }, loading, error } = useQuery(GET_PROJECTS);
  const [toggleProject] = useMutation(TOGGLE_PROJECT);

  let options = [];
  if (!loading && !error) {
    options = projects && projects.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
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
