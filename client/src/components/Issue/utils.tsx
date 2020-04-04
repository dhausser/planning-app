import React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '@atlaskit/tooltip';
import Lozenge from '@atlaskit/lozenge';
import { Status } from '@atlaskit/status';
import { RowType } from '@atlaskit/dynamic-table/dist/cjs/types';
import {
  statusCatecoryColorMap,
  priorityIconMap,
  issuetypeIconMap,
} from './Icon';
import { Issue } from '../../types';

export const head = {
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
  ],
};

export const row = ({
  key,
  fields: { summary, issuetype, status, priority, fixVersions, assignee },
}: Issue): RowType => ({
  key,
  cells: [
    {
      key,
      content: <Link to={`/issue/${key}`}>{key}</Link>,
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
      key: priority.id,
      content: priorityIconMap[priority.id],
    },
    {
      key: fixVersions[0] ? fixVersions[0].id : undefined,
      content: fixVersions[0] ? (
        <Tooltip content={fixVersions[0].name}>
          <Lozenge appearance="default">{fixVersions[0].name}</Lozenge>
        </Tooltip>
      ) : (
        ''
      ),
    },
  ],
});

export const getRows = (issues: Issue[]): RowType[] =>
  issues.map((issue) => row(issue));
