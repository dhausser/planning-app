import React from 'react';
import { Link } from 'react-router';
import { arrayOf, shape, string, bool, number } from 'prop-types';
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
      width: 4,
    },
    {
      key: 'key',
      content: 'Key',
      shouldTruncate: true,
      isSortable: true,
      width: 15,
    },
    {
      key: 'summary',
      content: 'Summary',
      shouldTruncate: true,
      isSortable: true,
      // width: 40,
    },
    {
      key: 'assignee',
      content: 'Assignee',
      shouldTruncate: true,
      isSortable: true,
      width: 10,
    },
    // {
    //   key: 'reporter',
    //   content: 'Reporter',
    //   shouldTruncate: true,
    //   isSortable: true,
    //   // width: 10,
    // },
    {
      key: 'priority',
      content: 'P',
      isSortable: true,
      width: 5,
    },
    {
      key: 'status',
      content: 'Status',
      // shouldTruncate: true,
      isSortable: true,
      width: 10,
    },
    {
      key: 'version',
      content: 'V',
      isSortable: true,
      width: 10,
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
        key: issue.fields.issuetype.id,
        content: typeIcon(issue.fields.issuetype.name),
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
        key: issue.fields.assignee.key,
        content: (
          <Link to={`/resource/${issue.fields.assignee.key}`}>
            {issue.fields.assignee.displayName}
          </Link>
        ),
      },
      // {
      //   key: issue.fields.creator.key,
      //   content: (
      //     <Link to={`/resource/${issue.fields.creator.key}`}>
      //       {issue.fields.creator.displayName}
      //     </Link>
      //   ),
      // },
      {
        key: issue.fields.priority.id,
        content: priorityIcon(issue.fields.priority.name),
      },
      {
        key: issue.fields.status.statusCategory.id,
        content: (
          <Status
            text={issue.fields.status.name}
            color={statusColor(issue.fields.status.statusCategory.key)}
          />
        ),
      },
      {
        key: issue.fields.fixVersions[0] && issue.fields.fixVersions[0].id,
        content:
          issue.fields.fixVersions[0] && issue.fields.fixVersions[0].name,
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
  maxResults: number,
  total: number,
  isLoading: bool,
  pathname: string,
};
