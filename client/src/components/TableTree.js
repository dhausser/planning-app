import React from 'react'
import { Link } from 'react-router-dom'
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree'
import CopyIcon from '@atlaskit/icon/glyph/copy'
import Tooltip from '@atlaskit/tooltip'
import { Status } from '@atlaskit/status'
import { getIcon } from './Issue/Icon'

import { hostname } from '../credentials'

export default ({ epics, stories }) => {
  if (!epics.length) return null
  if (!stories.length) return null

  epics.forEach(issue => {
    issue.children = []
    stories.forEach(child => {
      if (child.parent === issue.key) {
        issue.children.push(child)
      }
    })
  })

  const issues = epics.map(issue => reducer(issue)) || []

  return (
    <TableTree>
      <Headers>
        <Header width={120}>Type</Header>
        <Header width={150}>Key</Header>
        <Header width={550}>Summary</Header>
        <Header width={200}>Assignee</Header>
        <Header width={70}>Priority</Header>
        <Header width={170}>Status</Header>
        <Header width={80}>Link</Header>
      </Headers>
      <Rows
        items={issues}
        render={({
          key,
          summary,
          type,
          assignee,
          priority,
          status,
          children,
        }) => (
          <Row
            expandLabel="Expand"
            collapseLabel="Collapse"
            itemId={key}
            items={children}
            hasChildren={children && children.length > 0}
            isExpanded
          >
            <Cell singleLine>{type}</Cell>
            <Cell singleLine>
              <a
                href={`https://${hostname}/browse/${key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {key}
              </a>
            </Cell>
            <Cell singleLine>
              <Link to={`/issue/${key}`}>{summary}</Link>
            </Cell>
            <Cell singleLine>
              <Link to={`/resource/${assignee.key}`}>{assignee.name}</Link>
            </Cell>
            <Cell singleLine>{priority}</Cell>
            <Cell singleLine>{status}</Cell>
            <Cell singleLine>
              <Tooltip content={`View ${key}`}>
                <a
                  href={`https://${hostname}/browse/${key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CopyIcon size="medium" />
                </a>
              </Tooltip>
            </Cell>
          </Row>
        )}
      />
    </TableTree>
  )
}

function reducer(issue) {
  return {
    key: issue.key,
    summary: issue.summary,
    assignee: issue.assignee ? issue.assignee : { key: '', name: 'Unassigned' },
    type: getIcon[issue.type],
    priority: getIcon[issue.priority],
    status: (
      <Status text={issue.status.name} color={getIcon[issue.status.category]} />
    ),
    children: issue.children ? issue.children.map(child => reducer(child)) : [],
  }
}
