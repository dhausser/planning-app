import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';

export const TOGGLE_FILTER = gql`
  mutation toggleFilter($id: ID, $name: String, $type: String) {
    toggleFilter(id: $id, name: $name, type: $type) @client
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

const GET_STATUS = gql`
  query GetFilter {
    filter @client {
      status {
        id
      }
    }
  }
`;

function Toggle({
  loading, error, defaultValue, options, type,
}) {
  const [toggleFilter] = useMutation(TOGGLE_FILTER);

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
        onChange={(e) => {
          let id = null;
          let name = null;
          if (e) {
            ({ value: id, label: name } = e);
          }
          toggleFilter({ variables: { id, name, type } });
        }}
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
  defaultValue: PropTypes.objectOf(PropTypes.objectOf).isRequired,
  options: PropTypes.objectOf(PropTypes.objectOf).isRequired,
  type: PropTypes.string.isRequired,
};

export function ProjectFilter() {
  const type = 'Project';
  const { data: { filter: { project } } } = useQuery(GET_PROJECT);
  const { loading, error, data } = useQuery(GET_PROJECTS);

  const defaultValue = project.id
    && { value: project.id, label: project.name };
  const options = data.projects
    && data.projects.map(({ id, name }) => ({ value: id, label: name }));

  return (
    <Toggle
      loading={loading}
      error={error}
      options={options}
      defaultValue={defaultValue}
      type={type}
    />
  );
}

export function VersionFilter() {
  const type = 'Version';
  const { data: { filter: { project, version } } } = useQuery(GET_VERSION);
  const { loading, error, data } = useQuery(GET_VERSIONS, {
    variables: {
      id: project.id ? project.id : process.env.REACT_APP_PROJECT_ID,
      startAt: parseInt(process.env.REACT_APP_VERSION_START_AT, 10),
      maxResults: parseInt(process.env.REACT_APP_VERSION_MAX_RESULTS, 10),
    },
  });

  const defaultValue = version.id
    && { value: version.id, label: version.name };
  const options = data.versions
    && data.versions.map(({ id, name }) => ({ value: id, label: name }));

  return (
    <Toggle
      loading={loading}
      error={error}
      options={options}
      defaultValue={defaultValue}
      type={type}
    />
  );
}

export function StatusFilter() {
  const type = 'Status';
  const { data: { filter: { status } } } = useQuery(GET_STATUS);

  const options = [
    { value: '2', label: 'Open' },
    { value: '4', label: 'In Progress' },
    { value: '3', label: 'Closed' },
  ];
  const defaultValue = options.find(({ value }) => value === status.id);

  return <Toggle options={options} defaultValue={defaultValue} type={type} />;
}

export function TeamFilter() {
  const type = 'Team';
  const { data: { filter: { team } } } = useQuery(GET_TEAM);
  const { loading, error, data } = useQuery(GET_TEAMS);

  const defaultValue = team.id
    && { value: team.id, label: team.id };
  const options = data.teams
    && data.teams.map(({ id }) => ({ value: id, label: id }));

  return (
    <Toggle
      loading={loading}
      error={error}
      options={options}
      defaultValue={defaultValue}
      type={type}
    />
  );
}
