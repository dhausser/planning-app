import React from 'react'
import { ApolloConsumer, Mutation } from 'react-apollo'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Select from '@atlaskit/select'
import Button, { ButtonGroup } from '@atlaskit/button'
import EmptyState from '@atlaskit/empty-state'
import { projectId } from '../credentials'

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
    teams @client {
      _id
      members {
        key
      }
    }
    versions @client {
      id
      name
    }
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

// const SET_TEAMS = gql`
//   mutation setTeams($teams: [Team]) {
//     setTeams(teams: $teams) @client
//   }
// `
// const SET_VERSIONS = gql`
//   mutation setVersions($versions: [FixVersion]) {
//     setVersions(versions: $versions) @client
//   }
// `

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

  console.log(props.match)
  return (
    <>
      <ApolloConsumer>
        {client =>
          client.writeData({
            data: {
              teams,
              versions,
            },
          })
        }
      </ApolloConsumer>
      {props.match.path !== '/resources' && (
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
      {!['/roadmap', '/resource/:resourceId'].includes(props.match.path) && (
        <div style={{ marginLeft: 8 }}>
          <ButtonGroup>
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
      )}
    </>
  )
}
