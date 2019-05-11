import React from 'react'
import { Mutation } from 'react-apollo'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Select from '@atlaskit/select'
import Button from '@atlaskit/button'
import EmptyState from '@atlaskit/empty-state'

import { GET_VERSIONS, GET_TEAMS, GET_FILTERS } from '../lib/queries'

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
  const projectId = 10500

  const {
    data: { versions },
    loading: loadingVersions,
    error: errorVersions,
  } = useQuery(GET_VERSIONS, {
    variables: { id: projectId, pageSize: 5, after: 5 },
  })

  const {
    data: { teams },
    loading: loadingTeams,
    error: errorTeams,
  } = useQuery(GET_TEAMS)

  const {
    data: { version, team },
    loading: loadingFilters,
  } = useQuery(GET_FILTERS)

  if (loadingVersions || loadingTeams || loadingFilters) {
    return (
      <Button
        key="team"
        isLoading={loadingVersions || loadingTeams}
        appearance="subtle"
      >
        Filters
      </Button>
    )
  }
  if (errorVersions || errorTeams)
    return (
      <EmptyState
        header="Error"
        description={[errorVersions, errorTeams].map(({ message }) => message)}
      />
    )

  /**
   * TODO: GET_PROJECTS query
   */
  const projectOptions = [
    { value: 10500, label: 'Gwent' },
    { value: 10600, label: 'Cyberpunk' },
    { value: 10700, label: 'IT' },
  ]

  const versionOptions = versions.map(versionOption => ({
    value: versionOption.id,
    label: versionOption.name,
  }))

  const teamOptions = teams.map(teamOption => ({
    value: teamOption._id,
    label: teamOption._id,
  }))

  const renderProjectFilter = false
  const renderVersionFilter = props.match.path !== '/resources'
  const renderTeamFilter = !['/roadmap', '/resource/:resourceId'].includes(
    props.match.path,
  )

  console.log({ team, version })

  return (
    <>
      {renderProjectFilter && (
        <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
          <Mutation mutation={TOGGLE_PROJECT}>
            {toggleVersion => (
              <Select
                spacing="compact"
                className="single-select"
                classNamePrefix="react-select"
                isDisabled={false}
                isLoading={false}
                isClearable
                isSearchable
                options={projectOptions}
                placeholder="Choose a project"
                onChange={e => toggleVersion({ variables: { id: e } })}
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
                  version ? { value: version.id, label: version.name } : null
                }
                isDisabled={false}
                isLoading={loadingVersions}
                isClearable
                isSearchable
                options={versionOptions}
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
                defaultValue={team ? { value: team, label: team } : null}
                isDisabled={false}
                isLoading={loadingTeams}
                isClearable
                isSearchable
                options={teamOptions}
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
