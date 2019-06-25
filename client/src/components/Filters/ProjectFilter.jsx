import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';
import EmptyState from '@atlaskit/empty-state';

import { GET_PROJECTS } from '../../queries';

const TOGGLE_PROJECT = gql`
  mutation toggleProject($project: Project!) {
    toggleProject(project: $project) @client
  }
`;

function ProjectFilter({ project }) {
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    fetchPolicy: 'cache-first',
  });
  const toggleProject = useMutation(TOGGLE_PROJECT);

  if (error) return <EmptyState header={error.name} description={error.message} />;

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

ProjectFilter.defaultProps = {
  project: {},
};

ProjectFilter.propTypes = {
  project: PropTypes.objectOf(PropTypes.string),
};

export default ProjectFilter;
