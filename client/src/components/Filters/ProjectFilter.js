import React from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Select from '@atlaskit/select'
import { ButtonLoading } from '../Loading'
import Error from '../Error'
import { GET_PROJECTS } from '../queries'

const TOGGLE_PROJECT = gql`
  mutation toggleProject($project: Project!) {
    toggleProject(project: $project) @client
  }
`

export default ({ project }) => {
  const { data, loading, error } = useQuery(GET_PROJECTS)
  const toggleProject = useMutation(TOGGLE_PROJECT)

  if (loading) return <ButtonLoading />
  if (error) return <Error error={error} />

  return (
    <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
      <Select
        spacing="compact"
        className="single-select"
        classNamePrefix="react-select"
        defaultValue={project && { value: project.id, label: project.name }}
        isDisabled={false}
        isLoading={loading}
        isClearable
        isSearchable
        options={data.projects.map(option => ({
          value: option.id,
          label: option.name,
        }))}
        placeholder="Choose a project"
        onChange={e => toggleProject({ variables: { project: e } })}
      />
    </div>
  )
}
