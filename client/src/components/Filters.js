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

export const VERSION_FILTER_QUERY = gql`
  {
    versionId @client
    versionName @client
  }
`

export const TEAM_FILTER_QUERY = gql`
  {
    teamFilter @client
  }
`

export default () => (
  <ButtonGroup>
    <Query
      query={GET_VERSIONS}
      variables={{ id: projectId, pageSize: 5, after: 5 }}
    >
      {({ data, loading, error }) => {
        if (loading) return <Spinner size="medium" />
        if (error)
          return <EmptyState header="Error" description={error.message} />

        return (
          <Query query={VERSION_FILTER_QUERY}>
            {({ data: { versionName }, client }) => (
              <DropdownMenu
                isLoading={loading}
                trigger={`FixVersion: ${versionName}`}
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
                              versionId: version.id,
                              versionName: version.name,
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
            )}
          </Query>
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

        return data.teams.map((team, index) => (
          <Query key={index} query={TEAM_FILTER_QUERY}>
            {({ data: { teamFilter }, client }) => (
              <Button
                key={team._id}
                isLoading={loading}
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
            )}
          </Query>
        ))
      }}
    </Query>
  </ButtonGroup>
)
