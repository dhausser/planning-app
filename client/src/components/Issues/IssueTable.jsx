import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DynamicTable from '@atlaskit/dynamic-table';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { Status } from '@atlaskit/status';
import EmptyState from '@atlaskit/empty-state';
import { Icon } from '..';

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
    {
      key: 'link',
      content: 'Link',
      width: 6,
    },
  ],
};

const row = issue => ({
  key: issue.id,
  cells: [
    {
      key: issue.id,
      content: (
        <Link to={`/issue/${issue.key}`}>{issue.key}</Link>
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
        issue.fixVersions.length
        && issue.fixVersions[issue.fixVersions.length - 1].id,
      content:
        (issue.fixVersions.length
          && issue.fixVersions[issue.fixVersions.length - 1].name)
        || '',
    },
    {
      key: '',
      content: (
        <Tooltip content={`View ${issue.key}`}>
          <a
            href={`https://${process.env.REACT_APP_HOST}/browse/${issue.key}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CopyIcon size="medium" />
          </a>
        </Tooltip>
      ),
    },
  ],
});


function IssueTable({
  data, loading, error, fetchMore,
}) {
  const [offset, setOffset] = useState(20);

  return (
    <>
      <DynamicTable
        caption={caption(data.issues || {})}
        head={head}
        rows={!loading && data.issues.issues.length && data.issues.issues.map(row)}
        rowsPerPage={20}
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
