import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DynamicTable from '@atlaskit/dynamic-table';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { Status } from '@atlaskit/status';
import EmptyState from '@atlaskit/empty-state';
import { Icon } from '..';

import { GET_FILTERS, GET_RESOURCES, GET_ISSUES } from '../../queries';

const caption = (maxResults, total) => (
  <p>{`${maxResults <= total ? maxResults : total} of ${total}`}</p>
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

export function useIssues(query = GET_ISSUES, resourceId = null) {
  const { data: { project, version, team } } = useQuery(GET_FILTERS);
  const {
    data: { resources },
    loading: loadingResources,
    error: errorResources,
  } = useQuery(GET_RESOURCES);

  const assignee = resourceId || (team && !loadingResources && !errorResources
    ? resources
      .filter(resource => resource.team === team.id)
      .map(({ key }) => key)
    : null);

  const jql = `${project ? `project=${project.id} and ` : ''}${version
    ? `fixVersion in (${version.id}) and ` : ''}${assignee
    ? `assignee in (${assignee}) and ` : ''}statusCategory in (new, indeterminate)\
    order by priority desc, key asc`;

  const issues = useQuery(query, { variables: { jql, startAt: 0, maxResults: 20 } });

  return issues;
}

function IssueTable({ resourceId = null }) {
  const [offset, setOffset] = useState(20);
  const {
    data, loading, error, fetchMore,
  } = useIssues(GET_ISSUES, resourceId);

  if (error) return <EmptyState description={error.message} />;

  return (
    <>
      <DynamicTable
        caption={!loading && caption(data.issues.maxResults, data.issues.total)}
        head={head}
        rows={!loading && data.issues.issues.length && data.issues.issues.map(row)}
        rowsPerPage={20}
        loadingSpinnerSize="large"
        isLoading={loading}
        isFixedSize
        defaultSortKey="priority"
        defaultSortOrder="ASC"
        isRankable
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
  resourceId: null,
};

IssueTable.propTypes = {
  resourceId: PropTypes.string,
};

export default IssueTable;
