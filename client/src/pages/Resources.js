import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import DynamicTable from '@atlaskit/dynamic-table'
import Avatar from '@atlaskit/avatar'
import { NameWrapper, AvatarWrapper } from '../components/Page'
import { ProjectHomeView, Page, Header, Error } from '../components'
import { GET_RESOURCES, GET_FILTERS } from '../queries'

const ResourcesPage = props => {
  useEffect(() => {
    props.navigationViewController.setView(ProjectHomeView.id)
  }, [props.navigationViewController])

  const {
    data: { team },
  } = useQuery(GET_FILTERS)

  const { data, loading, error } = useQuery(GET_RESOURCES, {
    fetchPolicy: 'cache-first',
  })

  let resources = []
  if (error) return <Error error={error} />
  if (!loading)
    resources = team
      ? data.resources.filter(resource => resource.team === team.id)
      : data.resources
  return (
    <Page>
      <Header title="People" {...props} />
      <DynamicTable
        caption={`${resources.length} people`}
        head={head}
        rows={rows(resources)}
        rowsPerPage={20}
        loadingSpinnerSize="large"
        isLoading={loading}
        isFixedSize
        defaultSortKey="name"
        defaultSortOrder="ASC"
      />
    </Page>
  )
}
export default withNavigationViewController(ResourcesPage)

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input
}

const head = {
  cells: [
    {
      key: 'name',
      content: 'Name',
      isSortable: true,
    },
    {
      key: 'team',
      content: 'Team',
      isSortable: true,
      width: 15,
    },
  ],
}

const rows = resources =>
  resources.map(resource => ({
    key: resource.key,
    cells: [
      {
        key: createKey(resource.name),
        content: (
          <NameWrapper>
            <AvatarWrapper>
              <Avatar
                name={resource.name}
                size="medium"
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
        key: createKey(resource.team),
        content: resource.team,
      },
    ],
  }))
