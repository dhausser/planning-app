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
import { host } from '../config';

function EpicTree({ epics }) {
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
        items={epics}
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
          >
            <Cell singleLine>{type}</Cell>
            <Cell singleLine>
              <a
                href={`https://${host}/browse/${key}`}
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
                  href={`https://${host}/browse/${key}`}
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
  epics: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};

export default EpicTree;
