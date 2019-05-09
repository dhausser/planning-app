import React from 'react'
import { Mutation } from 'react-apollo'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Select from '@atlaskit/select'
import Button from '@atlaskit/button'
import EmptyState from '@atlaskit/empty-state'
import { projectId } from '../credentials'

import { GET_VERSIONS, GET_TEAMS, GET_FILTERS } from '../lib/queries'

const TOGGLE_VERSION = gql`
  mutation toggleVersion($version: FixVersion!) {
    toggleVersion(version: $version) @client
  }
`

const TOGGLE_TEAM = gql`
  mutation toggleTeam($team: String!) {
    toggleTeam(team: $team) @client
  }
`

export default function Filters(props) {
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
    data: { version: versionFilter, team: teamFilter },
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

  const versionOptions = versions.map(versionOption => ({
    value: versionOption.id,
    label: versionOption.name,
  }))

  const teamOptions = teams.map(teamOption => ({
    value: teamOption._id,
    label: teamOption._id,
  }))

  const renderVersionFilter = props.match.path !== '/resources'
  const renderTeamFilter = !['/roadmap', '/resource/:resourceId'].includes(
    props.match.path,
  )

  return (
    <>
      {renderVersionFilter && (
        <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
          <Mutation mutation={TOGGLE_VERSION}>
            {toggleVersion => (
              <Select
                spacing="compact"
                className="single-select"
                classNamePrefix="react-select"
                defaultValue={versionOptions.find(
                  ({ value }) => value === versionFilter.id,
                )}
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
                // defaultValue={teamOptions.find(
                //   ({ value }) => value === teamFilter,
                // )}
                isDisabled={false}
                isLoading={loadingTeams}
                isClearable
                isSearchable
                options={teamOptions}
                placeholder="Choose a team"
                onChange={e =>
                  toggleTeam({ variables: { team: e, teamFilter } })
                }
              />
            )}
          </Mutation>
        </div>
      )}
    </>
  )
}
