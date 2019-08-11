import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
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

const GET_VERSIONS = gql`
  query GetVersions($id: ID!, $startAt: Int, $maxResults: Int) {
    versions(id: $id, startAt: $startAt, maxResults: $maxResults) {
      id
      name
    }
  }
`;

const GET_TEAMS = gql`
  query GetTeams {
    teams {
      id
    }
  }
`;

const GET_PROJECT = gql`
  query GetFilter {
    filter @client {
      project {
        id
        name
      }
    }
  }
`;

const GET_VERSION = gql`
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

const GET_TEAM = gql`
  query GetFilter {
    filter @client {
      team {
        id
      }
    }
  }
`;

const TOGGLE_FILTER = gql`
  mutation toggleFilter($value: ID!, $label: String!, $__typename: String!) {
    toggleFilter(value: $value, label: $label, __typename: $__typename) @client
  }
`;

function Toggle({
  loading, error, data, filter, type,
}) {
  const [toggleFilter] = useMutation(TOGGLE_FILTER);
  const key = type.toLowerCase();
  const selection = filter[key];
  const items = data[`${key}s`];
  let defaultValue;
  let options;

  if (type === 'Team') {
    defaultValue = selection.id && { value: selection.id, label: selection.id };
    options = items && items.map(({ id }) => ({ value: id, label: id }));
  } else {
    defaultValue = selection.id && { value: selection.id, label: selection.name };
    options = items && items.map(({ id, name }) => ({ value: id, label: name }));
  }

  if (error) return `Error! ${error.message}`;

  return (
    <div style={{ flexBasis: 130, marginRight: 8 }}>
      <Select
        spacing="compact"
        isClearable={type !== 'Project'}
        defaultValue={defaultValue}
        isLoading={loading}
        options={options}
        placeholder={type}
        onChange={e => toggleFilter({ variables: { ...e, __typename: type } })}
      />
    </div>
  );
}

Toggle.defaultProps = {
  error: null,
};

Toggle.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.objectOf(),
  data: PropTypes.objectOf(PropTypes.objectOf).isRequired,
  filter: PropTypes.objectOf(PropTypes.objectOf).isRequired,
  type: PropTypes.string.isRequired,
};


export function ProjectFilter() {
  const type = 'Project';
  const { data: { filter } } = useQuery(GET_PROJECT);
  const results = useQuery(GET_PROJECTS);
  const options = { ...results, filter, type };
  return <Toggle {...options} />;
}

export function VersionFilter() {
  const type = 'Version';
  const { data: { filter } } = useQuery(GET_VERSION);
  const results = useQuery(GET_VERSIONS, {
    variables: {
      id: (filter.project && filter.project.id) || process.env.REACT_APP_PROJECT_ID,
      startAt: parseInt(process.env.REACT_APP_VERSION_START_AT, 10),
      maxResults: parseInt(process.env.REACT_APP_VERSION_MAX_RESULTS, 10),
    },
  });
  const options = { ...results, filter, type };
  return <Toggle {...options} />;
}

export function TeamFilter() {
  const type = 'Team';
  const { data: { filter } } = useQuery(GET_TEAM);
  const results = useQuery(GET_TEAMS);
  const options = { ...results, filter, type };
  return <Toggle {...options} />;
}
