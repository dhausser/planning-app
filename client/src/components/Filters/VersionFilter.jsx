import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';

const PROJECT_ID = '10500';

const GET_FILTERS = gql`
  query GetFilters {
    isLoggedIn @client
    project @client {
      id
      name
    }
    version @client {
      id
      name
    }
  }
`;

const GET_VERSIONS = gql`
  query GetVersions($id: ID!, $startAt: Int, $maxResults: Int) {
    versions(id: $id, startAt: $startAt, maxResults: $maxResults) {
      id
      name
    }
  }
`;

const TOGGLE_VERSION = gql`
  mutation toggleVersion($version: FixVersion!) {
    toggleVersion(version: $version) @client
  }
`;

function VersionFilter() {
  const { data: { project, version } } = useQuery(GET_FILTERS);
  const { data: { versions }, loading, error } = useQuery(GET_VERSIONS, {
    variables: {
      id: (project && project.id) || PROJECT_ID,
      startAt: 11,
      maxResults: 5,
    },
  });
  const [toggleVersion] = useMutation(TOGGLE_VERSION);

  let options = [];
  if (!loading && !error) {
    options = versions && versions.map(({ id, name }) => ({
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
        defaultValue={version && { value: version.id, label: version.name }}
        isDisabled={false}
        isLoading={loading}
        isClearable
        isSearchable
        options={options}
        placeholder="Choose a Version"
        onChange={e => toggleVersion({ variables: { version: e } })}
      />
    </div>
  );
}

export default VersionFilter;
