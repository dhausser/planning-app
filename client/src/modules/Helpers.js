import React from 'react';
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
import config from './credentials.json';

export const getIcon = {
  new: 'blue',
  indeterminate: 'yellow',
  done: 'green',
  P0: (
    <Tooltip content="P0">
      <PriorityBlockerIcon size="small" />
    </Tooltip>
  ),
  P1: (
    <Tooltip content="P1">
      <PriorityHighestIcon size="small" />
    </Tooltip>
  ),
  P2: (
    <Tooltip content="P2">
      <PriorityMediumIcon size="small" />
    </Tooltip>
  ),
  P3: (
    <Tooltip content="P3">
      <PriorityLowestIcon size="small" />
    </Tooltip>
  ),
  P4: (
    <Tooltip content="P4">
      <PriorityMinorIcon size="small" />
    </Tooltip>
  ),
  P5: (
    <Tooltip content="P5">
      <PriorityTrivialIcon size="small" />
    </Tooltip>
  ),
  Epic: (
    <Tooltip content="Epic">
      <Epic16Icon />
    </Tooltip>
  ),
  Story: (
    <Tooltip content="Story">
      <Story16Icon />
    </Tooltip>
  ),
  Task: (
    <Tooltip content="Task">
      <Task16Icon />
    </Tooltip>
  ),
  'Sub-task': (
    <Tooltip content="Sub-task">
      <Subtask16Icon />
    </Tooltip>
  ),
  Bug: (
    <Tooltip content="Bug">
      <Bug16Icon />
    </Tooltip>
  ),
};

export const convertIssues = issues =>
  issues.map(issue => ({
    type: getIcon[issue.fields.issuetype.name],
    key: issue.key,
    summary: issue.fields.summary,
    value: getIcon[issue.fields.priority.name],
    status: (
      <Status
        text={issue.fields.status.name}
        color={getIcon[issue.fields.status.statusCategory.key]}
      />
    ),
    children:
      issue.children &&
      issue.children.map(child => ({
        type: getIcon[child.fields.issuetype.name],
        key: child.key,
        summary: child.fields.summary,
        value: getIcon[child.fields.priority.name],
        status: (
          <Status
            text={child.fields.status.name}
            color={getIcon[child.fields.status.statusCategory.key]}
          />
        ),
        children: child.fields.subtasks.map(subtask => ({
          type: getIcon[subtask.fields.issuetype.name],
          key: subtask.key,
          summary: subtask.fields.summary,
          value: getIcon[subtask.fields.priority.name],
          status: (
            <Status
              text={subtask.fields.status.name}
              color={getIcon[subtask.fields.status.statusCategory.key]}
            />
          ),
          children: [],
        })),
      })),
  }));

export async function fetchIssues(
  bodyData = {},
  setData,
  ignore,
  resource = 'search'
) {
  const { hostname, path, Authorization } = config;

  const options = {
    hostname,
    path: `${path}/${resource}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization,
    },
  };

  const response = await fetch(`/api/${resource}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ options, bodyData }),
  });
  const result = await response.json();
  if (!ignore) setData({ ...result, isLoading: false });
}
