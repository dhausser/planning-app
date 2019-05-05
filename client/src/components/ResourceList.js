import React from 'react'
import { Link } from 'react-router-dom'
import DynamicTable from '@atlaskit/dynamic-table'
import Avatar from '@atlaskit/avatar'
import { NameWrapper, AvatarWrapper } from './Page'

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input
}

const createHead = withWidth => ({
  cells: [
    {
      key: 'name',
      content: 'Name',
      isSortable: true,
      width: withWidth ? 25 : undefined,
    },
    {
      key: 'team',
      content: 'Team',
      shouldTruncate: true,
      isSortable: true,
      width: withWidth ? 15 : undefined,
    },
  ],
})

const createRows = resources =>
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

export default function ResourceList({ resources, isLoading }) {
  const caption = `Listing ${resources.length} developers`
  const head = createHead('false')
  const rows = createRows(resources)
  return (
    <DynamicTable
      caption={caption}
      head={head}
      rows={rows}
      rowsPerPage={20}
      defaultPage={1}
      loadingSpinnerSize="large"
      isLoading={isLoading}
      isFixedSize
      defaultSortKey="name"
      defaultSortOrder="ASC"
    />
  )
}
