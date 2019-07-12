import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
    }
  }
`;

const GET_VISIBILITY_FILTER = gql`
  query GetVisibilityFilter {
    visibilityFilter @client {
      project {
        id
        name
      }
    }
  }
`;

const TOGGLE_FILTER = gql`
  mutation toggleFilter($value: ID!, $label: String!, $__typename: String!) {
    toggleFilter(value: $value, label: $label, __typename: $__typename) @client
  }
`;

function ProjectFilter() {
  const { data: { visibilityFilter: { project } } } = useQuery(GET_VISIBILITY_FILTER);
  // const { data: { project } } = useQuery(GET_VISIBILITY_FILTER);
  const { data: { projects }, loading, error } = useQuery(GET_PROJECTS);
  const [toggleFilter] = useMutation(TOGGLE_FILTER);

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
        onChange={e => toggleFilter({ variables: { ...e, __typename: 'Project' } })}
      />
    </div>
  );
}

export default ProjectFilter;
