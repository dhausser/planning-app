import React from 'react';
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

export default {
  // Status colors
  new: 'blue',
  indeterminate: 'yellow',
  done: 'green',

  // Priorities
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
  Medium: (
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

  // Standard issuetypes
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

  // Custom issuetypes
  Card: (
    <Tooltip content="Card">
      <Story16Icon />
    </Tooltip>
  ),
  Product: (
    <Tooltip content="Product">
      <Story16Icon />
    </Tooltip>
  ),
  'Live Event': (
    <Tooltip content="Live Event">
      <Task16Icon />
    </Tooltip>
  ),
  Feedback: (
    <Tooltip content="Feedback">
      <Task16Icon />
    </Tooltip>
  ),
  Backend: (
    <Tooltip content="Backend">
      <Task16Icon />
    </Tooltip>
  ),
};
