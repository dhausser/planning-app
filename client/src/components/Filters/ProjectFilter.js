import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Filter from './Filter';

const GET_PROJECTS = gql`{
  projectId @client
  projects {
    id
    name
  }
}
`;

export default function ProjectFilter({ client }) {
  const handleChange = (e) => client.writeQuery({
    query: gql`{
      projectId
      versionId
    }`,
    data: {
      projectId: e && e.value,
      versionId: null,
    },
  });

  return (
    <Filter
      handleChange={handleChange}
      query={GET_PROJECTS}
      items="projects"
      itemId="projectId"
    />
  );
}

ProjectFilter.propTypes = {
  client: PropTypes.func.isRequired,
};
