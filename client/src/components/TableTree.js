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

import { hostname } from '../credentials'

export default ({ issues }) => (
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
          // isExpanded
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
