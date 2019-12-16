import React from 'react';
import { useQuery, useApolloClient, gql } from '@apollo/client';
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
  const client = useApolloClient();
  const { data: { projectId } } = useQuery(GET_PROJECT_FILTER);
  const { loading, error, data } = useQuery(GET_PROJECTS);

  if (loading) return <Select spacing="compact" isLoading />;
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
        onChange={(e) => {
          if (e) {
            client.writeData({ data: { projectId: e.value } });
            localStorage.setItem('projectId', e.value);
          } else {
            client.writeData({ data: { projectId: null } });
            localStorage.removeItem('projectId');
          }
        }}
      />
    </div>
  );
}

export function VersionFilter() {
  const client = useApolloClient();
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
        onChange={(e) => {
          if (e) {
            client.writeData({ data: { versionId: e.value } });
            localStorage.setItem('versionId', e.value);
          } else {
            client.writeData({ data: { versionId: null } });
            localStorage.removeItem('versionId');
          }
        }}
      />
    </div>
  );
}

export function StatusFilter() {
  const client = useApolloClient();
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
        onChange={(e) => {
          if (e) {
            client.writeData({ data: { statusId: e.value } });
            localStorage.setItem('statusId', e.value);
          } else {
            client.writeData({ data: { statusId: null } });
            localStorage.removeItem('statusId');
          }
        }}
      />
    </div>
  );
}

export function TeamFilter() {
  const client = useApolloClient();
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
        onChange={(e) => {
          if (e) {
            client.writeData({ data: { teamId: e.value } });
            localStorage.setItem('teamId', e.value);
          } else {
            client.writeData({ data: { teamId: null } });
            localStorage.removeItem('teamId');
          }
        }}
      />
    </div>
  );
}
