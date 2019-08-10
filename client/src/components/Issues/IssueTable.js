import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DynamicTable from '@atlaskit/dynamic-table';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
// import CopyIcon from '@atlaskit/icon/glyph/copy';
import EmptyState from '@atlaskit/empty-state';
import Lozenge from '@atlaskit/lozenge';
import { Status } from '@atlaskit/status';

import { statusCatecoryColorMap, priorityIconMap, issuetypeIconMap } from '../Issue/Icon';
// import { copyLink } from '../Issue/Summary';

const ROWS_PER_PAGE = 10;
const caption = ({ maxResults, total }) => (
  `${(maxResults && (maxResults <= total ? maxResults : total)) || 0} of ${total || 0}`
);
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
    // {
    //   key: 'link',
    //   content: 'Link',
    //   width: 6,
    // },
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
    // {
    //   key: '',
    //   content: (
    //     <Tooltip content={`Copy to clipboard ${key}`}>
    //       <Button iconBefore={CopyIcon()} onClick={() => copyLink(key)} />
    //     </Tooltip>
    //   ),
    // },
  ],
});


function IssueTable({
  data, loading, error, fetchMore,
}) {
  const [offset, setOffset] = useState(ROWS_PER_PAGE);

  return (
    <>
      <DynamicTable
        caption={caption(data.issues || {})}
        head={head}
        rows={!loading && data.issues.issues.length && data.issues.issues.map(row)}
        rowsPerPage={ROWS_PER_PAGE}
        loadingSpinnerSize="large"
        isLoading={loading}
        isFixedSize
        defaultSortKey="priority"
        defaultSortOrder="ASC"
        isRankable
        emptyView={error && <EmptyState description={error.message} />}
      />
      {!loading && data.issues.total > offset && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1em',
          }}
        >
          <Button
            onClick={() => {
              setOffset(offset + data.issues.maxResults);
              return fetchMore({
                variables: {
                  startAt: offset,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...fetchMoreResult,
                    issues: {
                      ...fetchMoreResult.issues,
                      issues: [
                        ...prev.issues.issues,
                        ...fetchMoreResult.issues.issues,
                      ],
                    },
                  };
                },
              });
            }}
          >
            Load More
          </Button>
        </div>
      )}
    </>
  );
}

IssueTable.defaultProps = {
  data: {},
  loading: false,
  error: null,
};

IssueTable.propTypes = {
  data: PropTypes.objectOf(PropTypes.objectOf),
  loading: PropTypes.bool,
  error: PropTypes.objectOf(PropTypes.objectOf),
  fetchMore: PropTypes.func.isRequired,
};

export default IssueTable;