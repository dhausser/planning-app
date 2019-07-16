import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Select from '@atlaskit/select';

/**
 * Fetching all values for projects, version, teams
 */
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

/**
 * Fetching local filter state for project, version, team
 */
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

/**
 * Toggle filter mutations
 */
const TOGGLE_FILTER = gql`
  mutation toggleFilter($value: ID!, $label: String!, $__typename: String!) {
    toggleFilter(value: $value, label: $label, __typename: $__typename) @client
  }
`;

/**
 * Select Project
 */
export function ProjectFilter() {
  const { data: { filter: { project: { id: value, name: label } } } } = useQuery(GET_PROJECT);
  const { data: { projects }, loading } = useQuery(GET_PROJECTS, { fetchPolicy: 'cache-first' });
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
        options={projects && projects.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
        placeholder="Choose a project"
        onChange={e => toggleFilter({ variables: { ...e, __typename: 'Project' } })}
      />
    </div>
  );
}

/**
 * Select Version
 */
export function VersionFilter() {
  const {
    data: {
      filter: { project, version: { id: value, name: label } },
    },
  } = useQuery(GET_VERSION);
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

/**
 * Select Team
 */
export function TeamFilter() {
  const { data: { filter: { team: { id } } } } = useQuery(GET_TEAM);
  const { data: { teams }, loading } = useQuery(GET_TEAMS, { fetchPolicy: 'cache-first' });
  const [toggleFilter] = useMutation(TOGGLE_FILTER);

  return (
    <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
      <Select
        spacing="compact"
        className="single-select"
        classNamePrefix="react-select"
        defaultValue={id != null && { value: id, label: id }}
        isDisabled={false}
        isLoading={loading}
        isClearable
        isSearchable
        options={teams && teams.map(team => ({
          value: team.id,
          label: team.id,
        }))}
        placeholder="Choose a Team"
        onChange={e => toggleFilter({ variables: { ...e, __typename: 'Team' } })}
      />
    </div>
  );
}
