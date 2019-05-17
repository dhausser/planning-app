import React from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Select from '@atlaskit/select'
import { ButtonLoading } from '../Loading'
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

  if (loading) return <ButtonLoading />
  if (error) return <Error error={error} />

  return (
    <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
      <Select
        spacing="compact"
        className="single-select"
        classNamePrefix="react-select"
        defaultValue={team && { value: team.id, label: team.name }}
        isDisabled={false}
        isLoading={loading}
        isClearable
        isSearchable
        options={data.teams.map(option => ({
          value: option._id,
          label: option._id,
        }))}
        placeholder="Choose a team"
        onChange={e => toggleTeam({ variables: { team: e } })}
      />
    </div>
  )
}
