import React from 'react';
import { Link } from 'react-router';
import { arrayOf, shape, string } from 'prop-types';
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

export const statusColor = ({ statusCategory }) => {
  const colors = [
    "neutral",
    "purple",
    "blue",
    "red",
    "yellow",
    "green"
  ];

  switch (statusCategory) {
  case 'new': return colors[2];
  case 'indeterminate': return colors[4];
  case 'done': return colors[5];
  default: return colors[0];
  }
}

export const priorityIcon = ({ priority }) => {
  switch (priority) {
  case 'PO': return <PriorityBlockerIcon size="small" />
  case 'P1': return <PriorityHighestIcon size="small" />
  case 'P2': return <PriorityMediumIcon size="small" />
  case 'P3': return <PriorityLowestIcon size="small" />
  case 'P4': return <PriorityMinorIcon size="small" />
  case 'P5': return <PriorityTrivialIcon size="small" />
  default: return <PriorityBlockerIcon size="small" />
  }
}

const createHead = (withWidth, resources) => {
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

  if (resources != null) {
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

const createRows = (issues, resources) => issues.map((issue, index) => {
  const row = {
    key: `row-${index}-${issue.key}`,
    cells: [
      {
        content: (
          <NameWrapper>
            <Link to={`/single/${issue.key}`}>{issue.key}</Link>
          </NameWrapper>
        ),
      },
      {
        content: issue.summary,
      },
      {
        key: parseInt(issue.priority.charAt(1)) + 1,
        content: priorityIcon(issue),
      },
      {
        key: issue.statusCategory,
        content: <Status text={issue.status} color={statusColor(issue)} />,
      },
    ],
  };

  if (resources != null) {
    const { name } = resources.find(
      resource => resource.key === issue.assignee,
    );
    row.cells.push({
      content: <Link to={`/profile/${issue.assignee}`}>{name}</Link>,
    });
  }

  return row;
});

export default function IssueList({ issues, resources, isLoading }) {
  const caption = 'List of Issues';
  return (
    <Wrapper>
      <DynamicTable
        caption={caption}
        head={createHead(true, resources)}
        rows={createRows(issues, resources)}
        rowsPerPage={resources ? 20 : 10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={isLoading}
        isFixedSize
        defaultSortKey="value"
        defaultSortOrder="ASC"
        onSort={() => console.log('onSort')}
        onSetPage={() => console.log('onSetPage')}
      />
    </Wrapper>
  );
};

IssueList.propTypes = {
  issues: arrayOf(shape({
    key: string,
    summary: string,
    status: string,
    assignee: string,
  })).isRequired,
  resources: arrayOf(shape({
    key: string,
    name: string,
  })),
};