import React from 'react';
import { useApolloClient, useQuery, gql } from '@apollo/client';
import Select from '@atlaskit/select';

let client;

export const TOGGLE_FILTER = gql`
  mutation toggleFilter($id: ID, $name: String, $type: String) {
    toggleFilter(id: $id, name: $name, type: $type) @client
  }
`;

export const GET_TEAMS = gql`
  query GetTeams {
    teams {
      id
    }
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

const GET_PROJECT_FILTER = gql`
  {
    projectId @client
  }
`;

const GET_VERSION_FILTER = gql`
  {
    versionId @client
  }
`;

const GET_STATUS_FILTER = gql`
  {
    statusId @client
  }
`;

const GET_TEAM_FILTER = gql`
  {
    teamId @client
  }
`;

export function ProjectFilter() {
  client = useApolloClient();
  const { data: { projectId } } = useQuery(GET_PROJECT_FILTER);
  const { loading, error, data } = useQuery(GET_PROJECTS);

  if (loading || !data) return <Select spacing="compact" isLoading />;
  if (error) return <p>{error.message}</p>;

  let defaultValue;
  const options = data.projects && data.projects.map(({ id, name }) => {
    const option = { value: id, label: name };
    if (id === projectId) defaultValue = option;
    return option;
  });

  return (
    <div style={{ flexBasis: 130, marginRight: 8 }}>
      <Select
        spacing="compact"
        defaultValue={defaultValue}
        isLoading={loading}
        options={options}
        placeholder="Project"
        onChange={(e) => client.writeQuery({
          query: gql`{ projectId }`,
          data: { projectId: e && e.value },
        })}
      />
    </div>
  );
}

export function VersionFilter() {
  client = useApolloClient();
  const { data: { projectId } } = useQuery(GET_PROJECT_FILTER);
  const { data: { versionId } } = useQuery(GET_VERSION_FILTER);
  const { loading, error, data } = useQuery(GET_VERSIONS, {
    variables: {
      id: projectId || process.env.REACT_APP_PROJECT_ID,
      startAt: parseInt(process.env.REACT_APP_VERSION_START_AT, 10),
      maxResults: parseInt(process.env.REACT_APP_VERSION_MAX_RESULTS, 10),
    },
  });

  if (loading) return <Select spacing="compact" isLoading />;
  if (error) return <p>{error.message}</p>;

  let defaultValue;
  const options = data.versions && data.versions.map(({ id, name }) => {
    const option = { value: id, label: name };
    if (id === versionId) defaultValue = option;
    return option;
  });

  return (
    <div style={{ flexBasis: 130, marginRight: 8 }}>
      <Select
        spacing="compact"
        isClearable
        defaultValue={defaultValue}
        isLoading={loading}
        options={options}
        placeholder="Version"
        onChange={(e) => client.writeQuery({
          query: gql`{ versionId }`,
          data: { versionId: e && e.value },
        })}
      />
    </div>
  );
}

export function StatusFilter() {
  client = useApolloClient();
  const { data: { statusId } } = useQuery(GET_STATUS_FILTER);

  const options = [
    { value: '2', label: 'Open' },
    { value: '4', label: 'In Progress' },
    { value: '3', label: 'Closed' },
  ];
  const defaultValue = options.find(({ value }) => value === statusId);

  return (
    <div style={{ flexBasis: 130, marginRight: 8 }}>
      <Select
        spacing="compact"
        isClearable
        defaultValue={defaultValue}
        options={options}
        placeholder="Status"
        onChange={(e) => client.writeQuery({
          query: gql`{ statusId }`,
          data: { statusId: e && e.value },
        })}
      />
    </div>
  );
}

export function TeamFilter() {
  client = useApolloClient();
  const { data: { teamId } } = useQuery(GET_TEAM_FILTER);
  const { loading, error, data } = useQuery(GET_TEAMS);

  if (loading) return <div />;
  if (error) return <p>{error.message}</p>;

  let defaultValue;
  const options = data.teams && data.teams.map(({ id }) => {
    const option = { value: id, label: id };
    if (id === teamId) defaultValue = option;
    return option;
  });

  return (
    <div style={{ flexBasis: 130, marginRight: 8 }}>
      <Select
        spacing="compact"
        isClearable
        defaultValue={defaultValue}
        isLoading={loading}
        options={options}
        placeholder="Team"
        onChange={(e) => client.writeQuery({
          query: gql`{ teamId }`,
          data: { teamId: e && e.value },
        })}
      />
    </div>
  );
}
