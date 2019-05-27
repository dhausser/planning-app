import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import DynamicTable from '@atlaskit/dynamic-table'
import Button from '@atlaskit/button'
import Tooltip from '@atlaskit/tooltip'
import CopyIcon from '@atlaskit/icon/glyph/copy'
import { Status } from '@atlaskit/status'
import Icon from './IssueView/Icon'

import { hostname } from '../credentials'

/**
 * Dynamic Table
 * https://atlaskit.atlassian.com/packages/core/dynamic-table
 * @param {Int} maxResults
 * @param {Int} total
 * @param {Array} issues
 * @param {Boolean} loading
 * @param {Func} fetchMore
 */
export default function({ maxResults, total, issues, loading, fetchMore }) {
  const [offset, setOffset] = useState(20)

  return (
    <>
      <DynamicTable
        caption={caption(offset, maxResults, total)}
        head={head}
        rows={!loading && issues.length && issues.map(issueRow)}
        rowsPerPage={200}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={loading}
        isFixedSize
        defaultSortKey="priority"
        defaultSortOrder="ASC"
      />
      {total > offset && (
        <Button
          onClick={() => {
            setOffset(offset + maxResults)
            return fetchMore({
              variables: {
                startAt: offset,
              },
              updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                if (!fetchMoreResult) return prev
                return {
                  ...fetchMoreResult,
                  issues: {
                    ...fetchMoreResult.issues,
                    issues: [
                      ...prev.issues.issues,
                      ...fetchMoreResult.issues.issues,
                    ],
                  },
                }
              },
            })
          }}
        >
          Load More
        </Button>
      )}
    </>
  )
}

const caption = (startAt, maxResults, total) => (
  <p>
    {maxResults <= total ? maxResults : total} of {total}
  </p>
)

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
      content: Icon[issue.type],
    },
    {
      key: issue.status.category,
      content: (
        <Status text={issue.status.name} color={Icon[issue.status.category]} />
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
      content: Icon[issue.priority],
    },
    {
      key:
        issue.fixVersions.length &&
        issue.fixVersions[issue.fixVersions.length - 1].id,
      content:
        (issue.fixVersions.length &&
          issue.fixVersions[issue.fixVersions.length - 1].name) ||
        '',
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

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`
