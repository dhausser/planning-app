import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';

import { GET_VERSIONS } from '../../queries';

const PROJECT_ID = '10500';
const TOGGLE_VERSION = gql`
  mutation toggleVersion($version: FixVersion!) {
    toggleVersion(version: $version) @client
  }
`;

function VersionFilter({ version, project }) {
  const { data, loading, error } = useQuery(GET_VERSIONS, {
    variables: {
      id: (project && project.id) || PROJECT_ID,
      startAt: 11,
      maxResults: 5,
    },
  });
  const toggleVersion = useMutation(TOGGLE_VERSION);

  let options = [];

  if (!error) {
    options = data.versions && data.versions.map(option => ({
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

VersionFilter.defaultProps = {
  project: { id: '10500' },
  version: {},
};

VersionFilter.propTypes = {
  project: PropTypes.objectOf(PropTypes.string),
  version: PropTypes.objectOf(PropTypes.string),
};

export default VersionFilter;
