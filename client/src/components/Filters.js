import React from 'react'
import { Mutation } from 'react-apollo'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Select from '@atlaskit/select'
import Button, { ButtonGroup } from '@atlaskit/button'
import EmptyState from '@atlaskit/empty-state'
import { projectId } from '../credentials'

// import DropdownMenu, {
//   DropdownItemGroup,
//   DropdownItem,
// } from '@atlaskit/dropdown-menu'

const GET_VERSIONS = gql`
  query GetVersions($id: ID!, $pageSize: Int, $after: Int) {
    versions(id: $id, pageSize: $pageSize, after: $after) {
      id
      name
    }
  }
`

const GET_TEAMS = gql`
  query GetTeams {
    teams {
      _id
      size
      members {
        key
      }
    }
  }
`

export const GET_FILTERS = gql`
  query GetFilters {
    version @client {
      id
      name
    }
    team @client
  }
`

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

export default function Filters() {
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

  const versionOptions = versions.map(version => ({
    value: version.id,
    label: version.name,
  }))

  return (
    <>
      <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
        <Select
          spacing="compact"
          className="single-select"
          classNamePrefix="react-select"
          defaultValue={versionOptions[0]}
          // isDisabled={false}
          isLoading={loadingVersions}
          // isClearable={true}
          // isRtl={isRtl}
          // isSearchable={true}
          options={versionOptions}
          placeholder="Choose a version"
        />
      </div>
      <div>
        <ButtonGroup>
          {/* <DropdownMenu
        isLoading={loadingVersions}
        trigger={`FixVersion: ${versionFilter.name}`}
        triggerType="button"
        shouldFlip={false}
        position="right top"
      >
        <DropdownItemGroup>
          {versions &&
            versions.map(version => (
              <Mutation
                key={version.id}
                mutation={TOGGLE_VERSION}
                variables={{ version }}
              >
                {toggleVersion => (
                  <DropdownItem key={version.id} onClick={toggleVersion}>
                    {version.name}
                  </DropdownItem>
                )}
              </Mutation>
            ))}
        </DropdownItemGroup>
      </DropdownMenu> */}
          {teams.map(team => (
            <Mutation
              key={team}
              mutation={TOGGLE_TEAM}
              variables={{ team: { id: team._id, filter: teamFilter } }}
            >
              {toggleTeam => (
                <Button
                  key={team._id}
                  isLoading={loadingTeams}
                  appearance="subtle"
                  isSelected={teamFilter === team._id}
                  onClick={toggleTeam}
                >
                  {team._id}
                </Button>
              )}
            </Mutation>
          ))}
        </ButtonGroup>
      </div>
    </>
  )
}
