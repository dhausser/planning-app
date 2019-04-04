import React from 'react';
import { Link } from 'react-router-dom';
import { arrayOf, shape, string, bool, number } from 'prop-types';
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

function createRows(issues = []) {
  return issues.map((issue, index) => {
    let {
      fields: { assignee },
    } = issue;

    if (assignee) {
      const { key, displayName } = assignee;
      assignee = <Link to={`/resource/${key}`}>{displayName}</Link>;
    } else {
      assignee = 'Unassigned';
    }

    return {
      key: `row-${index}-${issue.key}`,
      cells: [
        {
          key: issue.fields.issuetype.id,
          content: getIcon[issue.fields.issuetype.name],
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
              <Link to={`/issue/${issue.key}`}>{issue.fields.summary}</Link>
            </NameWrapper>
          ),
        },
        {
          key: assignee,
          content: assignee,
        },
        {
          key: issue.fields.creator.key,
          content: (
            <Link to={`/resource/${issue.fields.creator.key}`}>
              {issue.fields.creator.displayName}
            </Link>
          ),
        },
        {
          key: issue.fields.priority.id,
          content: getIcon[issue.fields.priority.name],
        },
        {
          key: issue.fields.status.statusCategory.id,
          content: (
            <Status
              text={issue.fields.status.name}
              color={getIcon[issue.fields.status.statusCategory.key]}
            />
          ),
        },
        {
          key: issue.fields.fixVersions[0] && issue.fields.fixVersions[0].id,
          content:
            issue.fields.fixVersions[0] && issue.fields.fixVersions[0].name,
        },
      ],
    };
  });
}

export default function IssueList({
  issues,
  isLoading,
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
        isLoading={isLoading}
        isFixedSize
        defaultSortKey="priority"
        defaultSortOrder="ASC"
      />
    </Wrapper>
  );
}

IssueList.propTypes = {
  issues: arrayOf(
    shape({
      key: string,
      summary: string,
      status: string,
      assignee: string,
    })
  ).isRequired,
  maxResults: number,
  total: number,
  isLoading: bool,
  pathname: string,
};
