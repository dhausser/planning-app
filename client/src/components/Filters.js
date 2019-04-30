import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Button, { ButtonGroup } from '@atlaskit/button'
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import { projectId, defaultFixVersion } from '../credentials'

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

export const LOCAL_STATE_QUERY = gql`
  {
    teamFilter @client
    versionFilter @client
  }
`

export default () => (
  <Query query={LOCAL_STATE_QUERY}>
    {({ data: { versionFilter, teamFilter }, client }) => (
      <ButtonGroup>
        <Query
          query={GET_VERSIONS}
          variables={{ id: projectId, pageSize: 5, after: 5 }}
        >
          {({ data, loading, error }) => {
            if (loading) return <Spinner size="medium" />
            if (error)
              return <EmptyState header="Error" description={error.message} />

            console.log(versionFilter)
            return (
              <DropdownMenu
                isLoading={loading}
                trigger={`FixVersion: ${(versionFilter && versionFilter.name) ||
                  defaultFixVersion.name}`}
                triggerType="button"
                shouldFlip={false}
                position="right top"
              >
                <DropdownItemGroup>
                  {data.versions &&
                    data.versions.map(version => (
                      <DropdownItem
                        key={version.id}
                        onClick={() => {
                          client.writeData({
                            data: {
                              versionFilter: version,
                            },
                          })
                          localStorage.setItem(
                            'version',
                            JSON.stringify(version),
                          )
                        }}
                      >
                        {version.name}
                      </DropdownItem>
                    ))}
                </DropdownItemGroup>
              </DropdownMenu>
            )
          }}
        </Query>
        <Query query={GET_TEAMS}>
          {({ data, loading, error }) => {
            if (loading)
              return (
                <Button key="team" isLoading={loading} appearance="subtle">
                  Teams
                </Button>
              )
            if (error)
              return <EmptyState header="Error" description={error.message} />

            console.log(teamFilter)
            return data.teams.map(team => (
              <Button
                key={team._id}
                isLoading={loading}
                appearance="subtle"
                isSelected={teamFilter === team._id}
                onClick={() => {
                  const updatedFilter =
                    teamFilter !== team._id ? team._id : null
                  client.writeData({
                    data: {
                      teamFilter: updatedFilter,
                    },
                  })
                  localStorage.setItem('team', updatedFilter)
                }}
              >
                {team._id}
              </Button>
            ))
          }}
        </Query>
      </ButtonGroup>
    )}
  </Query>
)
