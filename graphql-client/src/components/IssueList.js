import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DynamicTable from '@atlaskit/dynamic-table';
import { Status } from '@atlaskit/status';
import { getIcon } from './Helpers';

const Wrapper = styled.div`
  min-width: 600px;
`;

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const head = {
  cells: [
    {
      key: 'type',
      content: 'T',
      isSortable: true,
      width: 3,
    },
    {
      key: 'key',
      content: 'Key',
      isSortable: true,
      width: 14,
    },
    {
      key: 'summary',
      content: 'Summary',
      isSortable: true,
    },
    {
      key: 'assignee',
      content: 'Assignee',
      isSortable: true,
      width: 16,
    },
    {
      key: 'reporter',
      content: 'Reporter',
      isSortable: true,
      width: 16,
    },
    {
      key: 'priority',
      content: 'P',
      isSortable: true,
      width: 4,
    },
    {
      key: 'status',
      content: 'Status',
      isSortable: true,
      width: 18,
    },
    {
      key: 'version',
      content: 'V',
      isSortable: true,
      width: 6,
    },
  ],
};

const createRows = (issues = []) =>
  issues.map((issue, index) => ({
    key: `row-${index}-${issue.key}`,
    cells: [
      {
        key: issue.type,
        content: getIcon[issue.type],
      },
      {
        key: issue.id,
        content: (
          <NameWrapper>
            <Link to={`/issue/${issue.key}`}>{issue.key}</Link>
          </NameWrapper>
        ),
      },
      {
        key: issue.id,
        content: (
          <NameWrapper>
            <Link to={`/issue/${issue.key}`}>{issue.summary}</Link>
          </NameWrapper>
        ),
      },
      {
        key: issue.assignee.id,
        content: (
          <Link to={`/resource/${issue.assignee.id}`}>
            {issue.assignee.name}
          </Link>
        ),
      },
      {
        key: issue.reporter.id,
        content: (
          <Link to={`/resource/${issue.reporter.id}`}>
            {issue.reporter.name}
          </Link>
        ),
      },
      {
        key: issue.priority,
        content: getIcon[issue.priority],
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
        key: issue.fixVersion && issue.fixVersion.id,
        content: issue.fixVersion && issue.fixVersion.name,
      },
    ],
  }));

export default function IssueList({
  issues,
  loading,
  maxResults,
  total,
  pathname,
}) {
  const caption = `Listing ${
    maxResults <= total ? maxResults : total
  } issues of ${total}`;
  return (
    <Wrapper>
      <DynamicTable
        caption={caption}
        head={head}
        rows={createRows(issues, pathname)}
        rowsPerPage={pathname === '/issues' ? 10 : 5}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={loading}
        isFixedSize
        defaultSortKey="priority"
        defaultSortOrder="ASC"
      />
    </Wrapper>
  );
}
