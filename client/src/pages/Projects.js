import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
// import gql from 'graphql-tag'
import Avatar from '@atlaskit/avatar'
import DynamicTable from '@atlaskit/dynamic-table'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productHomeView } from '../components/Nav'
import { Page, Loading, Error } from '../components'
import { NameWrapper, AvatarWrapper } from '../components/Page'

import { GET_PROJECTS } from '../queries'

// const TOGGLE_PROJECT = gql`
//   mutation toggleProject($project: Project!) {
//     toggleProject(project: $project) @client
//   }
// `

const Projects = props => {
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    fetchPolicy: 'cache-first',
  })
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
      key: 'name',
      content: 'Name',
      isSortable: true,
      width: 30,
    },
    {
      key: 'key',
      content: 'Key',
      isSortable: true,
      width: 10,
    },
    {
      key: 'type',
      content: 'Type',
      width: 15,
    },
    {
      key: 'lead',
      content: 'Lead',
      isSortable: true,
    },
    {
      key: 'url',
      content: 'URL',
      isSortable: true,
    },
    {
      key: 'starred',
      content: 'Starred',
    },
  ],
}

const resource = {
  key: 'davy.hausser',
  name: 'Davy Hausser',
}

const row = project => ({
  key: project.id,
  cells: [
    {
      key: project.name,
      content: (
        <NameWrapper>
          <AvatarWrapper>
            <Avatar
              name={project.name}
              size="small"
              appearance="square"
              src={project.avatarUrls.small}
            />
          </AvatarWrapper>
          <Link to={`/backlog/${project.key}`}>{project.name}</Link>
        </NameWrapper>
      ),
    },
    {
      key: project.key,
      content: project.key,
    },
    {
      key: project.projectTypeKey,
      content: project.projectTypeKey,
    },
    {
      key: project.key,
      content: (
        <NameWrapper>
          <AvatarWrapper>
            <Avatar
              name={resource.name}
              size="small"
              src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${
                resource.key
              }`}
            />
          </AvatarWrapper>
          <Link to={`/resource/${resource.key}`}>{resource.name}</Link>
        </NameWrapper>
      ),
    },
    {
      key: project.key,
      content: '',
    },
    {
      key: project.key,
      content: '',
    },
  ],
})
