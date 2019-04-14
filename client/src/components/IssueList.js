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
      width: 8,
    },
    {
      key: 'summary',
      content: 'Summary',
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
      width: 12,
    },
    {
      key: 'assignee',
      content: 'Assignee',
      isSortable: true,
      width: 10,
    },
    // {
    //   key: 'reporter',
    //   content: 'Reporter',
    //   isSortable: true,
    //   width: 16,
    // },
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

const createRows = (issues = []) =>
  issues.map((issue, index) => ({
    key: `row-${index}-${issue.key}`,
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
        key: issue.id,
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
        key: (issue.assignee && issue.assignee.id) || '',
        content: (
          <Link to={`/resource/${(issue.assignee && issue.assignee.id) || ''}`}>
            {(issue.assignee && issue.assignee.name) || ''}
          </Link>
        ),
      },
      // {
      //   key: issue.reporter && issue.reporter.id,
      //   content: (
      //     <Link to={`/resource/${issue.reporter && issue.reporter.id}`}>
      //       {issue.reporter && issue.reporter.name}
      //     </Link>
      //   ),
      // },
      {
        key: issue.priority,
        content: getIcon[issue.priority],
      },
      {
        key: issue.fixVersions && issue.fixVersions[0].id,
        content: issue.fixVersions && issue.fixVersions[0].name,
      },
    ],
  }))

export default function IssueList({
  issues,
  loading,
  maxResults,
  total,
  pathname,
}) {
  const caption = `Listing ${
    maxResults <= total ? maxResults : total
  } issues of ${total}`
  return (
    <Wrapper>
      <DynamicTable
        caption={caption}
        head={head}
        rows={createRows(issues, pathname)}
        rowsPerPage={pathname === '/issues' ? 10 : 5}
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
