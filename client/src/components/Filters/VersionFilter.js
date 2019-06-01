import React from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Select from '@atlaskit/select'
import Error from '../Error'
import { GET_VERSIONS } from '../../queries'

const TOGGLE_VERSION = gql`
  mutation toggleVersion($version: FixVersion!) {
    toggleVersion(version: $version) @client
  }
`

const DEFAULTS = {
  projectId: 10500,
  startAt: 7,
  maxResults: 5,
}

export default ({ version, project }) => {
  const variables = {
    id: (project && project.id) || DEFAULTS.projectId,
    startAt: DEFAULTS.startAt,
    maxResults: DEFAULTS.maxResults,
  }
  const { data, loading, error } = useQuery(GET_VERSIONS, {
    variables,
    fetchPolicy: 'cache-first',
  })
  const toggleVersion = useMutation(TOGGLE_VERSION)

  if (error) return <Error error={error} />

  return (
    <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
      <Select
        spacing="compact"
        className="single-select"
        // className="multi-select"
        classNamePrefix="react-select"
        defaultValue={version && { value: version.id, label: version.name }}
        isDisabled={false}
        isLoading={loading}
        isClearable
        isSearchable
        options={
          data.versions &&
          data.versions.map(option => ({
            value: option.id,
            label: option.name,
          }))
        }
        // isMulti
        placeholder="Choose a Version"
        onChange={e => toggleVersion({ variables: { version: e } })}
      />
    </div>
  )
}
