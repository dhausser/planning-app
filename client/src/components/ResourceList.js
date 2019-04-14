import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import DynamicTable from '@atlaskit/dynamic-table'
import Avatar from '@atlaskit/avatar'
import { NameWrapper, AvatarWrapper } from './ContentWrapper'

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input
}

const Wrapper = styled.div`
  min-width: 600px;
`

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
      shouldTruncate: true,
      isSortable: true,
    },
  ],
}

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
  return (
    <Wrapper>
      <DynamicTable
        caption={`Listing ${resources.length} developers`}
        head={head}
        rows={createRows(resources)}
        rowsPerPage={20}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={isLoading}
        isFixedSize
        defaultSortKey="name"
        defaultSortOrder="ASC"
      />
    </Wrapper>
  )
}
