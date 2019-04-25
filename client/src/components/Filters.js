import React, { Fragment, useContext } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Button, { ButtonGroup } from '@atlaskit/button'
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import { FilterContext } from '../context/FilterContext'
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

export default function Filters() {
  const { teamFilter, setTeamFilter, fixVersion, setFixVersion } = useContext(
    FilterContext,
  )

  return (
    <Fragment>
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
              <DropdownMenu
                isLoading={loading}
                trigger={`FixVersion: ${fixVersion && fixVersion.name}`}
                triggerType="button"
                shouldFlip={false}
                position="right top"
              >
                <DropdownItemGroup>
                  {data.versions &&
                    data.versions.map(version => (
                      <DropdownItem
                        key={version.id}
                        onClick={() => setFixVersion(version)}
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

            return data.teams.map(team => (
              <Button
                key={team._id}
                isLoading={loading}
                appearance="subtle"
                isSelected={team._id === teamFilter}
                onClick={() =>
                  setTeamFilter(teamFilter !== team._id ? team._id : null)
                }
              >
                {team._id}
              </Button>
            ))
          }}
        </Query>
      </ButtonGroup>
    </Fragment>
  )
}

/**
 * TODO: Reinstate Localstorage
 */

// const team = localStorage.getItem('team')
//   ? JSON.parse(localStorage.getItem('team'))
//   : null;
// const fixVersion = localStorage.getItem('fixVersion')
//   ? JSON.parse(localStorage.getItem('fixVersion'))
//   : fixVersions.values[0];
