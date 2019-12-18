import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import DynamicTable from '@atlaskit/dynamic-table';
import Tooltip from '@atlaskit/tooltip';
import EmptyState from '@atlaskit/empty-state';
import Lozenge from '@atlaskit/lozenge';
import { Status } from '@atlaskit/status';

import { statusCatecoryColorMap, priorityIconMap, issuetypeIconMap } from './Icon';

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
  ],
};
const row = ({
  key, fields: {
    summary,
    issuetype,
    status,
    priority,
    fixVersions,
    assignee,
  },
}) => ({
  key,
  cells: [
    {
      key,
      content: (
        <Link to={`/issue/${key}`}>{key}</Link>
      ),
    },
    {
      key: summary,
      content: summary,
    },
    {
      key: issuetype.id,
      content: issuetypeIconMap[issuetype.id],
    },
    {
      key: status.category,
      content: (
        <Status
          text={status.name}
          color={statusCatecoryColorMap[status.statusCategory.id]}
        />
      ),
    },
    {
      key: assignee && assignee.key,
      content: (
        <Link to={`/resource/${assignee && assignee.key}`}>
          {assignee && assignee.displayName}
        </Link>
      ),
    },
    {
      key: priority,
      content: priorityIconMap[priority.id],
    },
    {
      key: fixVersions[0] ? fixVersions[0].id : null,
      content: (
        fixVersions[0]
          ? (
            <Tooltip content={fixVersions[0].name}>
              <Lozenge appearance="default">{fixVersions[0].name}</Lozenge>
            </Tooltip>
          )
          : ''
      ),
    },
  ],
});

const IssueTable = ({ loading, error, issues, rowsPerPage, startAt }) => (
  <DynamicTable
    // caption={issues && `${issues.total < startAt ? issues.total : startAt} of ${issues.total}`}
    head={head}
    rows={issues
      && issues.issues
      && issues.issues.map(row)}
    rowsPerPage={rowsPerPage}
    loadingSpinnerSize="large"
    isLoading={loading}
    isFixedSize
    defaultSortKey="priority"
    defaultSortOrder="ASC"
    isRankable
    emptyView={error && <EmptyState description={error.message} />}
  />
);

IssueTable.defaultProps = {
  issues: {},
  loading: false,
  error: null,
};

IssueTable.propTypes = {
  loading: PropTypes.bool,
  rowsPerPage: PropTypes.number.isRequired,
  startAt: PropTypes.number.isRequired,
  error: PropTypes.objectOf(PropTypes.objectOf),
  issues: PropTypes.objectOf(PropTypes.objectOf),
};

export default IssueTable;
