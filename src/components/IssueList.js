import React from 'react';
import { Link } from 'react-router';
import { arrayOf, shape, string, bool } from 'prop-types';
import styled from 'styled-components';
import DynamicTable from '@atlaskit/dynamic-table';
import { Status } from '@atlaskit/status';
import PriorityBlockerIcon from '@atlaskit/icon-priority/glyph/priority-blocker';
import PriorityHighestIcon from '@atlaskit/icon-priority/glyph/priority-highest';
import PriorityMediumIcon from '@atlaskit/icon-priority/glyph/priority-medium';
import PriorityLowestIcon from '@atlaskit/icon-priority/glyph/priority-lowest';
import PriorityMinorIcon from '@atlaskit/icon-priority/glyph/priority-minor';
import PriorityTrivialIcon from '@atlaskit/icon-priority/glyph/priority-trivial';

const Wrapper = styled.div`
  min-width: 600px;
`;

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

export const statusColor = category => {
  const colors = ['neutral', 'purple', 'blue', 'red', 'yellow', 'green'];

  switch (category) {
    case 'new':
      return colors[2];
    case 'indeterminate':
      return colors[4];
    case 'done':
      return colors[5];
    default:
      return colors[0];
  }
};

export const priorityIcon = priority => {
  switch (priority) {
    case 'PO':
      return <PriorityBlockerIcon size="small" />;
    case 'P1':
      return <PriorityHighestIcon size="small" />;
    case 'P2':
      return <PriorityMediumIcon size="small" />;
    case 'P3':
      return <PriorityLowestIcon size="small" />;
    case 'P4':
      return <PriorityMinorIcon size="small" />;
    case 'P5':
      return <PriorityTrivialIcon size="small" />;
    default:
      return <PriorityBlockerIcon size="small" />;
  }
};

const createHead = (withWidth, pathname) => {
  const head = {
    cells: [
      {
        key: 'key',
        content: 'Key',
        isSortable: true,
        width: withWidth ? 10 : undefined,
      },
      {
        key: 'summary',
        content: 'Summary',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 30 : undefined,
      },
      {
        key: 'value',
        content: 'Value',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 5 : undefined,
      },
      {
        key: 'status',
        content: 'Status',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
    ],
  };

  if (pathname === '/issues') {
    head.cells.push({
      key: 'assignee',
      content: 'Assignee',
      shouldTruncate: true,
      isSortable: true,
      width: withWidth ? 15 : undefined,
    });
  }

  return head;
};

const createRows = (issues, pathname) =>
  issues.map((issue, index) => {
    const row = {
      key: `row-${index}-${issue.key}`,
      cells: [
        {
          content: (
            <NameWrapper>
              <Link to={`/issue/${issue.key}`}>{issue.key}</Link>
            </NameWrapper>
          ),
        },
        {
          content: issue.summary,
        },
        {
          key: parseInt(issue.priority.charAt(1)) + 1,
          content: priorityIcon(issue.priority),
        },
        {
          key: issue.statusCategory,
          content: (
            <Status
              text={issue.status}
              color={statusColor(issue.statusCategory)}
            />
          ),
        },
      ],
    };

    if (pathname === '/issues') {
      row.cells.push({
        key: issue.assignee,
        content: (
          <Link to={`/resource/${issue.assignee}`}>{issue.displayName}</Link>
        ),
      });
    }

    return row;
  });

export default function IssueList({ issues, isLoading, pathname }) {
  const caption = `Listing ${issues.length} issues`;
  return (
    <Wrapper>
      <DynamicTable
        caption={caption}
        head={createHead(true, pathname)}
        rows={createRows(issues, pathname)}
        rowsPerPage={pathname === '/issues' ? 20 : 10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={isLoading}
        isFixedSize
        defaultSortKey="value"
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
  isLoading: bool,
  pathname: string,
};
