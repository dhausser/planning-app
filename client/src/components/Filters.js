import React from 'react'
import { Mutation, ApolloConsumer } from 'react-apollo'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Button, { ButtonGroup } from '@atlaskit/button'
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
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
  {
    # versionFitler @client {
    #   id
    #   name
    # }
    versionId @client
    versionName @client
    teamFilter @client
  }
`

// export const VERSION_FILTER_QUERY = gql`
//   {
//     versionId @client
//     versionName @client
//   }
// `

// export const TEAM_FILTER_QUERY = gql`
//   {
//     teamFilter @client
//   }
// `

const TOGGLE_VERSION = gql`
  mutation toggleVersion($version: FixVersion!) {
    toggleVersion(version: $version) @client
  }
`

export default () => {
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
    data: { versionFilter, versionId, versionName, teamFilter },
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

  console.log({ versionFilter, versionId, versionName, teamFilter })

  return (
    <ApolloConsumer>
      {client => (
        <ButtonGroup>
          <DropdownMenu
            isLoading={loadingVersions}
            trigger={`FixVersion: ${versionName}`}
            triggerType="button"
            shouldFlip={false}
            position="right top"
          >
            <DropdownItemGroup>
              {versions &&
                versions.map(version => (
                  <Mutation mutation={TOGGLE_VERSION} variables={{ version }}>
                    {toggleVersion => (
                      <DropdownItem
                        key={version.id}
                        onClick={() => {
                          toggleVersion()
                          localStorage.setItem(
                            'version',
                            JSON.stringify(version),
                          )
                        }}
                      >
                        {version.name}
                      </DropdownItem>
                    )}
                  </Mutation>
                ))}
            </DropdownItemGroup>
          </DropdownMenu>
          {teams.map(team => (
            <Button
              key={team._id}
              isLoading={loadingTeams}
              appearance="subtle"
              isSelected={teamFilter === team._id}
              onClick={() => {
                let updatedFilter
                if (teamFilter !== team._id) {
                  updatedFilter = team._id
                  localStorage.setItem('team', updatedFilter)
                } else {
                  updatedFilter = null
                  localStorage.removeItem('team')
                }
                client.writeData({
                  data: {
                    teamFilter: updatedFilter,
                  },
                })
              }}
            >
              {team._id}
            </Button>
          ))}
        </ButtonGroup>
      )}
    </ApolloConsumer>
  )
}
