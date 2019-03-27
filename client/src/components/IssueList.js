import React from 'react';
import { Link } from 'react-router';
import { arrayOf, shape, string, bool, number } from 'prop-types';
import styled from 'styled-components';
import DynamicTable from '@atlaskit/dynamic-table';
import { Status } from '@atlaskit/status';
import Tooltip from '@atlaskit/tooltip';

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
  let icon = null;
  switch (priority) {
    case 'P0':
      icon = <PriorityBlockerIcon size="small" />;
      break;
    case 'P1':
      icon = <PriorityHighestIcon size="small" />;
      break;
    case 'P2':
      icon = <PriorityMediumIcon size="small" />;
      break;
    case 'P3':
      icon = <PriorityLowestIcon size="small" />;
      break;
    case 'P4':
      icon = <PriorityMinorIcon size="small" />;
      break;
    case 'P5':
      icon = <PriorityTrivialIcon size="small" />;
      break;
    default:
      icon = <PriorityBlockerIcon size="small" />;
  }
  return <Tooltip content={priority}>{icon}</Tooltip>;
}

export function typeIcon(type) {
  let icon = null;
  switch (type) {
    case 'Epic':
      icon = <Epic16Icon alt={type} />;
      break;
    case 'Story':
      icon = <Story16Icon alt={type} />;
      break;
    case 'Task':
      icon = <Task16Icon alt={type} />;
      break;
    case 'Sub-task':
      icon = <Subtask16Icon alt={type} />;
      break;
    case 'Bug':
      icon = <Bug16Icon alt={type} />;
      break;
    default:
      icon = <Task16Icon alt={type} />;
      break;
  }
  return <Tooltip content={type}>{icon}</Tooltip>;
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
      isSortable: true,
      width: 9,
    },
    {
      key: 'summary',
      content: 'Summary',
      isSortable: true,
    },
    {
      key: 'assignee',
      content: 'Assignee',
      shouldTruncate: true,
      isSortable: true,
      width: 12,
    },
    {
      key: 'reporter',
      content: 'Reporter',
      isSortable: true,
      width: 12,
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
      isSortable: true,
      width: 12,
    },
    {
      key: 'version',
      content: 'V',
      isSortable: true,
      width: 5,
    },
  ],
};

function createRows(issues = []) {
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
