import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';
import Error from '../Error';

import { PROJECT_TILE_DATA } from '../../queries';

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      ...ProjectTile
    }
  }
  ${PROJECT_TILE_DATA}
`;

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

  if (error) return <Error error={error} />;

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
        options={
          data.projects
          && data.projects.map(option => ({
            value: option.id,
            label: option.name,
          }))
        }
        placeholder="Choose a project"
        onChange={e => toggleProject({ variables: { project: e } })}
      />
    </div>
  );
}

ProjectFilter.propTypes = {
  project: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default ProjectFilter;
