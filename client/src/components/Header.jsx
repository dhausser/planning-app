import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import styled from 'styled-components';

import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button, { ButtonGroup } from '@atlaskit/button';
import EmptyState from '@atlaskit/empty-state';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import Select from '@atlaskit/select';

import { NameWrapper } from './Page';
import Loading from './Loading';
import {
  GET_FILTERS, GET_PROJECTS, GET_VERSIONS, GET_TEAMS,
} from '../queries';

const PROJECT_ID = '10500';

const TOGGLE_PROJECT = gql`
  mutation toggleProject($project: Project!) {
    toggleProject(project: $project) @client
  }
`;

const TOGGLE_VERSION = gql`
  mutation toggleVersion($version: FixVersion!) {
    toggleVersion(version: $version) @client
  }
`;

const TOGGLE_TEAM = gql`
  mutation toggleTeam($team: Team!) {
    toggleTeam(team: $team) @client
  }
`;

function Header({ title, avatar }) {
  const { data: { project, version, team }, loading, error } = useQuery(GET_FILTERS);
  const { data: { teams }, loading: loadingTeams, error: errorTeams } = useQuery(GET_TEAMS);
  const {
    data: { projects },
    loading: loadingProjects,
    error: errorProjects,
  } = useQuery(GET_PROJECTS);
  const {
    data: { versions },
    loading: loadingVersions,
    error: errorVersions,
  } = useQuery(GET_VERSIONS, {
    variables: {
      id: (project && project.id) || PROJECT_ID,
      startAt: 11,
      maxResults: 5,
    },
  });

  const toggleProject = useMutation(TOGGLE_PROJECT);
  const toggleVersion = useMutation(TOGGLE_VERSION);
  const toggleTeam = useMutation(TOGGLE_TEAM);

  // if (loading) return <Loading />;
  // if (error) return <EmptyState header={error.name} description={error.message} />;

  // Project Options
  let projectOptions = [];
  if (!loadingProjects && !errorProjects) {
    projectOptions = projects && projects.map(option => ({
      value: option.id,
      label: option.name,
    }));
  } else {
    console.error(error);
  }

  // Version options
  let versionOptions = [];
  if (!loadingVersions && !errorVersions) {
    versionOptions = versions && versions.map(option => ({
      value: option.id,
      label: option.name,
    }));
  } else {
    console.error(error);
  }

  // Team options
  let teamOptions = [];
  if (!loadingTeams && !errorTeams) {
    teamOptions = teams && teams.map(({ _id: id }) => ({
      value: id,
      label: id,
    }));
  } else {
    console.error(error);
  }

  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem text="Some project" key="Some project" />
      <BreadcrumbsItem text="Parent page" key="Parent page" />
    </BreadcrumbsStateless>
  );
  const actionsContent = (
    <ButtonGroup>
      <Button appearance="primary">Primary Action</Button>
      <Button>Default</Button>
      <Button>...</Button>
    </ButtonGroup>
  );
  const barContent = (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '0 0 200px' }}>
        <TextField isCompact placeholder="Filter" aria-label="Filter" />
      </div>
      <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
        <Select
          spacing="compact"
          className="single-select"
          classNamePrefix="react-select"
          defaultValue={project && { value: project.id, label: project.name }}
          isDisabled={false}
          isLoading={loading}
          isClearable
          isSearchable
          options={projectOptions}
          placeholder="Choose a project"
          onChange={e => toggleProject({ variables: { project: e } })}
        />
      </div>
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
          options={versionOptions}
          placeholder="Choose a Version"
          onChange={e => toggleVersion({ variables: { version: e } })}
        />
      </div>
      <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
        <Select
          spacing="compact"
          className="single-select"
          classNamePrefix="react-select"
          defaultValue={team && { value: team.id, label: team.name }}
          isDisabled={false}
          isLoading={loading}
          isClearable
          isSearchable
          options={teamOptions}
          placeholder="Choose a Team"
          onChange={e => toggleTeam({ variables: { team: e } })}
        />
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        breadcrumbs={breadcrumbs}
        actions={actionsContent}
        bottomBar={barContent}
      >
        {avatar
          ? (
            <NameWrapper>
              {avatar}
              {title}
            </NameWrapper>
          )
          : title}
      </PageHeader>
    </>
  );
}

Header.defaultProps = {
  avatar: null,
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  avatar: PropTypes.element,
};

export default Header;
