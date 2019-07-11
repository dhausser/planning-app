import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import Tooltip from '@atlaskit/tooltip';
import { Status } from '@atlaskit/status';
import { Icon } from '..';

function EpicTree({ roadmapIssues }) {
  return (
    <TableTree>
      <Headers>
        <Header width={120}>Type</Header>
        <Header width={150}>Key</Header>
        <Header width={400}>Summary</Header>
        <Header width={200}>Assignee</Header>
        <Header width={70}>Priority</Header>
        <Header width={170}>Status</Header>
        <Header width={80}>Link</Header>
      </Headers>
      <Rows
        items={roadmapIssues}
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
            key
            expandLabel="Expand"
            collapseLabel="Collapse"
            itemId={key}
            items={children}
            hasChildren={children && children.length > 0}
          >
            <Cell singleLine>{Icon[type]}</Cell>
            <Cell singleLine>
              <a
                href={`https://${process.env.REACT_APP_HOST}/browse/${key}`}
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
            <Cell singleLine>{Icon[priority]}</Cell>
            <Cell singleLine>
              <Status text={status.name} color={Icon[status.category]} />
            </Cell>
            <Cell singleLine>
              <Tooltip content={`View ${key}`}>
                <a
                  href={`https://${process.env.REACT_APP_HOST}/browse/${key}`}
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
  );
}

EpicTree.propTypes = {
  roadmapIssues: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};

export default EpicTree;
