import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import DynamicTable from '@atlaskit/dynamic-table'
import Tooltip from '@atlaskit/tooltip'
import CopyIcon from '@atlaskit/icon/glyph/copy'
import { Status } from '@atlaskit/status'
import { getIcon } from './Icon'

import { hostname } from '../../credentials'

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
      width: 7,
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
      width: 10,
    },
    {
      key: 'assignee',
      content: 'Assignee',
      isSortable: true,
      width: 10,
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
    {
      key: 'link',
      content: 'Link',
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
        issue.fixVersions.length &&
        issue.fixVersions[issue.fixVersions.length - 1].id,
      content:
        issue.fixVersions.length &&
        issue.fixVersions[issue.fixVersions.length - 1].name,
    },
    {
      key: '',
      content: (
        <Tooltip content={`View ${issue.key}`}>
          <a
            href={`https://${hostname}/browse/${issue.key}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CopyIcon size="medium" />
          </a>
        </Tooltip>
      ),
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
  )
}
