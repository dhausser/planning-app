import React from 'react'
import { Mutation } from 'react-apollo'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Select from '@atlaskit/select'
import Button from '@atlaskit/button'
import Error from './Error'

import { GET_PROJECTS, GET_VERSIONS, GET_TEAMS, GET_FILTERS } from './queries'
import { projectId } from '../credentials.json'

const TOGGLE_PROJECT = gql`
  mutation toggleVersion($project: Project!) {
    toggleProject(project: $project) @client
  }
`

const TOGGLE_VERSION = gql`
  mutation toggleVersion($version: FixVersion!) {
    toggleVersion(version: $version) @client
  }
`

const TOGGLE_TEAM = gql`
  mutation toggleTeam($team: Team!) {
    toggleTeam(team: $team) @client
  }
`

export default function Filters(props) {
  const {
    data: { projects },
    loading: loadingProjects,
    error: errorProjects,
  } = useQuery(GET_PROJECTS)

  const {
    data: { versions },
    loading: loadingVersions,
    error: errorVersions,
  } = useQuery(GET_VERSIONS, {
    variables: { id: projectId, pageSize: 10, after: 0 },
  })

  const {
    data: { teams },
    loading: loadingTeams,
    error: errorTeams,
  } = useQuery(GET_TEAMS)

  const {
    data: { project, version, team },
    loading: loadingFilters,
  } = useQuery(GET_FILTERS)

  if (loadingProjects || loadingVersions || loadingTeams || loadingFilters) {
    return (
      <Button key="team" isLoading appearance="subtle">
        Filters
      </Button>
    )
  }
  if (errorProjects) return <Error error={errorProjects} />
  if (errorVersions) return <Error error={errorVersions} />
  if (errorTeams) return <Error error={errorTeams} />

  const renderProjectFilter = true
  const renderVersionFilter = props.match.path !== '/resources'
  const renderTeamFilter = !['/roadmap', '/resource/:resourceId'].includes(
    props.match.path,
  )

  return (
    <>
      {renderProjectFilter && (
        <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
          <Mutation mutation={TOGGLE_PROJECT}>
            {toggleProject => (
              <Select
                spacing="compact"
                className="single-select"
                classNamePrefix="react-select"
                defaultValue={
                  project && { value: project.id, label: project.name }
                }
                isDisabled={false}
                isLoading={false}
                isClearable
                isSearchable
                options={projects.map(option => ({
                  value: option.id,
                  label: option.name,
                }))}
                placeholder="Choose a project"
                onChange={e => toggleProject({ variables: { project: e } })}
              />
            )}
          </Mutation>
        </div>
      )}
      {renderVersionFilter && (
        <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
          <Mutation mutation={TOGGLE_VERSION}>
            {toggleVersion => (
              <Select
                spacing="compact"
                className="single-select"
                classNamePrefix="react-select"
                defaultValue={
                  version && { value: version.id, label: version.name }
                }
                isDisabled={false}
                isLoading={loadingVersions}
                isClearable
                isSearchable
                options={versions.map(option => ({
                  value: option.id,
                  label: option.name,
                }))}
                placeholder="Choose a version"
                onChange={e => toggleVersion({ variables: { version: e } })}
              />
            )}
          </Mutation>
        </div>
      )}
      {renderTeamFilter && (
        <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
          <Mutation mutation={TOGGLE_TEAM}>
            {toggleTeam => (
              <Select
                spacing="compact"
                className="single-select"
                classNamePrefix="react-select"
                defaultValue={team && { value: team, label: team }}
                isDisabled={false}
                isLoading={loadingTeams}
                isClearable
                isSearchable
                options={teams.map(option => ({
                  value: option._id,
                  label: option._id,
                }))}
                placeholder="Choose a team"
                onChange={e => toggleTeam({ variables: { team: e } })}
              />
            )}
          </Mutation>
        </div>
      )}
    </>
  )
}
