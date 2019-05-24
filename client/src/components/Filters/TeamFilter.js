import React from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Select from '@atlaskit/select'
import Error from '../Error'
import { GET_TEAMS } from '../queries'

const TOGGLE_TEAM = gql`
  mutation toggleTeam($team: Team!) {
    toggleTeam(team: $team) @client
  }
`

export default ({ team }) => {
  const { data, loading, error } = useQuery(GET_TEAMS)
  const toggleTeam = useMutation(TOGGLE_TEAM)

  if (error) return <Error error={error} />

  return (
    <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
      <Select
        spacing="compact"
        className="single-select"
        // className="multi-select"
        classNamePrefix="react-select"
        defaultValue={team && { value: team.id, label: team.name }}
        isDisabled={false}
        isLoading={loading}
        isClearable
        isSearchable
        options={
          data.teams &&
          data.teams.map(option => ({
            value: option._id,
            label: option._id,
          }))
        }
        // isMulti
        placeholder="Choose a Team"
        onChange={e => toggleTeam({ variables: { team: e } })}
      />
    </div>
  )
}
