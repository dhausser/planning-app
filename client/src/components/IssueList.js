import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import DynamicTable from '@atlaskit/dynamic-table'
import { Status } from '@atlaskit/status'

import { getIcon } from './Icon'

const Wrapper = styled.div`
  min-width: 600px;
`

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`

const head = {
  cells: [
    {
      key: 'key',
      content: 'Key',
      isSortable: true,
      width: 13,
    },
    {
      key: 'summary',
      content: 'Summary',
      shouldTruncate: true,
      isSortable: true,
    },
    {
      key: 'type',
      content: 'T',
      isSortable: true,
      width: 5,
    },
    {
      key: 'status',
      content: 'Status',
      isSortable: true,
      width: 18,
    },
    {
      key: 'assignee',
      content: 'Assignee',
      isSortable: true,
      width: 19,
    },
    {
      key: 'priority',
      content: 'P',
      isSortable: true,
      width: 4,
    },
    {
      key: 'version',
      content: 'V',
      isSortable: true,
      width: 6,
    },
  ],
}

const issueRow = issue => ({
  key: issue.id,
  cells: [
    {
      key: issue.id,
      content: (
        <NameWrapper>
          <Link to={`/issue/${issue.key}`}>{issue.key}</Link>
        </NameWrapper>
      ),
    },
    {
      key: issue.summary,
      content: issue.summary,
    },
    {
      key: issue.type,
      content: getIcon[issue.type],
    },
    {
      key: issue.status.category,
      content: (
        <Status
          text={issue.status.name}
          color={getIcon[issue.status.category]}
        />
      ),
    },
    {
      key: (issue.assignee && issue.assignee.key) || '',
      content: (
        <Link to={`/resource/${(issue.assignee && issue.assignee.key) || ''}`}>
          {(issue.assignee && issue.assignee.name) || ''}
        </Link>
      ),
    },
    {
      key: issue.priority,
      content: getIcon[issue.priority],
    },
    {
      key:
        issue.fixVersions && issue.fixVersions[issue.fixVersions.length - 1].id,
      content:
        issue.fixVersions &&
        issue.fixVersions[issue.fixVersions.length - 1].name,
    },
  ],
})

export default function IssueList({
  issues,
  loading,
  maxResults,
  total,
  pageSize,
}) {
  const caption = `Listing ${
    maxResults <= total ? maxResults : total
  } issues of ${total}`
  return (
    <Wrapper>
      <DynamicTable
        caption={caption}
        head={head}
        rows={issues.map(issueRow)}
        rowsPerPage={pageSize}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={loading}
        isFixedSize
        defaultSortKey="priority"
        defaultSortOrder="ASC"
      />
    </Wrapper>
  )
}
