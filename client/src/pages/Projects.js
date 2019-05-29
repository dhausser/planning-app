import React, { useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import DynamicTable from '@atlaskit/dynamic-table'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productHomeView } from '../components/Nav'
import { Page, Loading, Error } from '../components'
import { GET_PROJECTS } from '../queries'

const TOGGLE_PROJECT = gql`
  mutation toggleProject($project: Project!) {
    toggleProject(project: $project) @client
  }
`

const Projects = props => {
  const { data, loading, error } = useQuery(GET_PROJECTS)
  // const toggleProject = useMutation(TOGGLE_PROJECT)

  useEffect(() => {
    props.navigationViewController.setView(productHomeView.id)
  }, [props.navigationViewController])

  return (
    <Page>
      <h1>Projects</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <Error error={error} />
      ) : (
        <DynamicTable
          caption={`Displaying ${data.projects.length} projects`}
          head={head}
          rows={!loading && data.projects.length && data.projects.map(row)}
          rowsPerPage={20}
          loadingSpinnerSize="large"
          isLoading={loading}
          isFixedSize
          defaultSortKey="name"
          defaultSortOrder="ASC"
        />
      )}
    </Page>
  )
}
export default withNavigationViewController(Projects)

const head = {
  cells: [
    {
      key: 'id',
      content: 'Id',
      isSortable: true,
      width: 10,
    },
    {
      key: 'key',
      content: 'Key',
      isSortable: true,
      width: 20,
    },
    {
      key: 'name',
      content: 'Name',
      isSortable: true,
    },
  ],
}

const row = project => ({
  key: project.id,
  cells: [
    {
      key: project.id,
      content: project.id,
    },
    {
      key: project.key,
      content: project.key,
    },
    {
      key: project.name,
      content: project.name,
    },
  ],
})
