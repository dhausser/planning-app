import React from 'react';
import { Link } from 'react-router';
import { arrayOf, shape, string, bool } from 'prop-types';
import styled from 'styled-components';
import DynamicTable from '@atlaskit/dynamic-table';
import { Status } from '@atlaskit/status';

// Import Priority Icons
import PriorityBlockerIcon from '@atlaskit/icon-priority/glyph/priority-blocker';
import PriorityHighestIcon from '@atlaskit/icon-priority/glyph/priority-highest';
import PriorityMediumIcon from '@atlaskit/icon-priority/glyph/priority-medium';
import PriorityLowestIcon from '@atlaskit/icon-priority/glyph/priority-lowest';
import PriorityMinorIcon from '@atlaskit/icon-priority/glyph/priority-minor';
import PriorityTrivialIcon from '@atlaskit/icon-priority/glyph/priority-trivial';

// Import Status Icons
import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import Task16Icon from '@atlaskit/icon-object/glyph/task/16';
import Subtask16Icon from '@atlaskit/icon-object/glyph/subtask/16';
import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';

const Wrapper = styled.div`
  min-width: 600px;
`;

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

export function statusColor(category) {
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
}

export function priorityIcon(priority) {
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
}

export function typeIcon(type) {
  switch (type) {
    case 'Epic':
      return <Epic16Icon alt={type} />;
    case 'Story':
      return <Story16Icon alt={type} />;
    case 'Task':
      return <Task16Icon alt={type} />;
    case 'Sub-task':
      return <Subtask16Icon alt={type} />;
    case 'Bug':
      return <Bug16Icon alt={type} />;
    default:
      return <Task16Icon alt={type} />;
  }
}

const head = {
  cells: [
    {
      key: 'type',
      content: 'T',
      isSortable: true,
      width: 2,
    },
    {
      key: 'key',
      content: 'Key',
      shouldTruncate: true,
      isSortable: true,
      width: 10,
    },
    {
      key: 'summary',
      content: 'Summary',
      shouldTruncate: true,
      isSortable: true,
      // width: 20,
    },
    {
      key: 'assignee',
      content: 'Assignee',
      shouldTruncate: true,
      isSortable: true,
      width: 10,
    },
    {
      key: 'reporter',
      content: 'Reporter',
      shouldTruncate: true,
      isSortable: true,
      width: 10,
    },
    {
      key: 'priority',
      content: 'P',
      isSortable: true,
      width: 3,
    },
    {
      key: 'status',
      content: 'Status',
      // shouldTruncate: true,
      isSortable: true,
      width: 15,
    },
    {
      key: 'version',
      content: 'FixVersion',
      // shouldTruncate: true,
      isSortable: true,
      width: 5,
    },
  ],
};
// if (pathname === '/issues') {
//   head.cells.push({
//     key: 'assignee',
//     content: 'Assignee',
//     shouldTruncate: true,
//     isSortable: true,
//     width: 1d,
//   });
// }

function createRows(issues) {
  return issues.map((issue, index) => ({
    key: `row-${index}-${issue.key}`,
    cells: [
      {
        key: issue.issuetype[0],
        content: typeIcon(issue.issuetype),
      },
      {
        content: (
          <NameWrapper>
            <Link to={`/issue/${issue.key}`}>{issue.key}</Link>
          </NameWrapper>
        ),
      },
      {
        key: issue.summary[0],
        content: (
          <NameWrapper>
            <Link to={`/issue/${issue.key}`}>{issue.summary}</Link>
          </NameWrapper>
        ),
      },
      {
        key: issue.assignee,
        content: (
          <Link to={`/resource/${issue.assignee}`}>{issue.displayName}</Link>
        ),
      },
      {
        key: issue.creator,
        content: (
          <Link to={`/resource/${issue.creatorKey}`}>{issue.creatorName}</Link>
        ),
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
      {
        key: issue.fixVersion,
        content: issue.fixVersion,
      },
    ],
  }));
}
// if (pathname === '/issues') {
//   row.cells.push({
//     key: issue.assignee,
//     content: (
//       <Link to={`/resource/${issue.assignee}`}>{issue.displayName}</Link>
//     ),
//   });
// }
// return row;

export default function IssueList({ issues, isLoading, pathname }) {
  const caption = `Listing ${issues.length} issues`;
  return (
    <Wrapper>
      <DynamicTable
        caption={caption}
        head={head}
        rows={createRows(issues, pathname)}
        rowsPerPage={pathname === '/issues' ? 20 : 10}
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
  isLoading: bool,
  pathname: string,
};
