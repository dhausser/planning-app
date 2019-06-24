import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';
import Error from '../Error';
import { GET_VERSIONS } from '../../queries';

const TOGGLE_VERSION = gql`
  mutation toggleVersion($version: FixVersion!) {
    toggleVersion(version: $version) @client
  }
`;

function VersionFilter({ version, project }) {
  const variables = {
    id: (project && project.id),
    startAt: 7,
    maxResults: 5,
  };
  const { data, loading, error } = useQuery(GET_VERSIONS, {
    variables,
    fetchPolicy: 'network-only',
  });
  const toggleVersion = useMutation(TOGGLE_VERSION);

  if (error) return <Error error={error} />;

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
        options={
          data.versions
          && data.versions.map(option => ({
            value: option.id,
            label: option.name,
          }))
        }
        placeholder="Choose a Version"
        onChange={e => toggleVersion({ variables: { version: e } })}
      />
    </div>
  );
}

VersionFilter.defaultProps = {
  project: { id: '10500' },
  version: {},
};

VersionFilter.propTypes = {
  project: PropTypes.objectOf(PropTypes.string),
  version: PropTypes.objectOf(PropTypes.string),
};

export default VersionFilter;
