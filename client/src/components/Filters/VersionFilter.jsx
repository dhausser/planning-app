import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';

const GET_VERSIONS = gql`
  query GetVersions($id: ID!, $startAt: Int, $maxResults: Int) {
    versions(id: $id, startAt: $startAt, maxResults: $maxResults) {
      id
      name
    }
  }
`;

const GET_FILTER = gql`
  query GetFilter {
    filter @client {
      project {
        id
        name
      }
      version {
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

function VersionFilter() {
  const { data: { filter: { project, version: { id: value, name: label } } } } = useQuery(GET_FILTER);
  const { data: { versions }, loading } = useQuery(GET_VERSIONS, {
    variables: {
      id: (project && project.id) || process.env.REACT_APP_PROJECT_ID,
      startAt: parseInt(process.env.REACT_APP_VERSION_START_AT, 10),
      maxResults: parseInt(process.env.REACT_APP_VERSION_MAX_RESULTS, 10),
    },
    fetchPolicy: 'cache-first',
  });
  const [toggleFilter] = useMutation(TOGGLE_FILTER);

  return (
    <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
      <Select
        spacing="compact"
        className="single-select"
        classNamePrefix="react-select"
        defaultValue={value && { value, label }}
        isDisabled={false}
        isLoading={loading}
        isClearable
        isSearchable
        options={versions && versions.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
        placeholder="Choose a Version"
        onChange={e => toggleFilter({ variables: { ...e, __typename: 'Version' } })}
      />
    </div>
  );
}

export default VersionFilter;
