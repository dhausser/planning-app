import React from 'react';
import Tooltip from '@atlaskit/tooltip';

// Import Priority Icons
import PriorityBlockerIcon from '@atlaskit/icon-priority/glyph/priority-blocker';
import PriorityCriticalIcon from '@atlaskit/icon-priority/glyph/priority-critical';
// import PriorityMajorIcon from '@atlaskit/icon-priority/glyph/priority-major';
import PriorityHighestIcon from '@atlaskit/icon-priority/glyph/priority-highest';
// import PriorityHighIcon from '@atlaskit/icon-priority/glyph/priority-high';
import PriorityMediumIcon from '@atlaskit/icon-priority/glyph/priority-medium';
import PriorityLowIcon from '@atlaskit/icon-priority/glyph/priority-low';
// import PriorityLowestIcon from '@atlaskit/icon-priority/glyph/priority-lowest';
// import PriorityMinorIcon from '@atlaskit/icon-priority/glyph/priority-minor';
import PriorityTrivialIcon from '@atlaskit/icon-priority/glyph/priority-trivial';

// Import Status Icons
import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import Task16Icon from '@atlaskit/icon-object/glyph/task/16';
import Subtask16Icon from '@atlaskit/icon-object/glyph/subtask/16';
import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';

export const issuetypeIconMap = {
  1: <Bug16Icon />,
  3: <Task16Icon />,
  5: <Subtask16Icon />,
  10000: <Epic16Icon />,
  10001: <Story16Icon />,
};

export const priorityIconMap = {
  10400: <PriorityBlockerIcon size="small" />,
  10401: <PriorityCriticalIcon size="small" />,
  10402: <PriorityHighestIcon size="small" />,
  10403: <PriorityMediumIcon size="small" />,
  10404: <PriorityLowIcon size="small" />,
  10405: <PriorityTrivialIcon size="small" />,
};

export const statusCatecoryColorMap = {
  2: 'blue',
  3: 'green',
  4: 'yellow',
};

export default {
  // Status colors
  new: 'blue',
  indeterminate: 'yellow',
  done: 'green',

  // Priorities
  Outage: (
    <Tooltip content="Outage">
      <PriorityBlockerIcon size="small" />
    </Tooltip>
  ),
  Problem: (
    <Tooltip content="Problem">
      <PriorityCriticalIcon size="small" />
    </Tooltip>
  ),
  Must: (
    <Tooltip content="Must">
      <PriorityHighestIcon size="small" />
    </Tooltip>
  ),
  Should: (
    <Tooltip content="Should">
      <PriorityMediumIcon size="small" />
    </Tooltip>
  ),
  Could: (
    <Tooltip content="Could">
      <PriorityLowIcon size="small" />
    </Tooltip>
  ),
  "Won't": (
    <Tooltip content="Won't">
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

// export const priorityIconMap = {
//   10400: (
//     <Tooltip content="Outage">
//       <PriorityBlockerIcon size="small" />
//     </Tooltip>
//   ),
//   10401: (
//     <Tooltip content="Problem">
//       <PriorityCriticalIcon size="small" />
//     </Tooltip>
//   ),
//   10402: (
//     <Tooltip content="Must">
//       <PriorityHighestIcon size="small" />
//     </Tooltip>
//   ),
//   10403: (
//     <Tooltip content="Should">
//       <PriorityMediumIcon size="small" />
//     </Tooltip>
//   ),
//   10404: (
//     <Tooltip content="Could">
//       <PriorityLowIcon size="small" />
//     </Tooltip>
//   ),
//   10405: (
//     <Tooltip content="Won't">
//       <PriorityTrivialIcon size="small" />
//     </Tooltip>
//   ),
// };

// export const issuetypeIconMap = {
//   1: (
//     <Tooltip content="Bug">
//       <Bug16Icon />
//     </Tooltip>
//   ),
//   3: (
//     <Tooltip content="Task">
//       <Task16Icon />
//     </Tooltip>
//   ),
//   5: (
//     <Tooltip content="Sub-task">
//       <Subtask16Icon />
//     </Tooltip>
//   ),
//   10000: (
//     <Tooltip content="Epic">
//       <Epic16Icon />
//     </Tooltip>
//   ),
//   10001: (
//     <Tooltip content="Story">
//       <Story16Icon />
//     </Tooltip>
//   ),
// };
