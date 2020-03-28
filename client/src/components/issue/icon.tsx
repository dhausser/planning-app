import React, { ReactNode } from 'react';

// Import Priority Icons
import PriorityBlockerIcon from '@atlaskit/icon-priority/glyph/priority-blocker';
import PriorityCriticalIcon from '@atlaskit/icon-priority/glyph/priority-critical';
import PriorityHighestIcon from '@atlaskit/icon-priority/glyph/priority-highest';
import PriorityMediumIcon from '@atlaskit/icon-priority/glyph/priority-medium';
import PriorityLowIcon from '@atlaskit/icon-priority/glyph/priority-low';
import PriorityTrivialIcon from '@atlaskit/icon-priority/glyph/priority-trivial';

// Import Status Icons
import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import Task16Icon from '@atlaskit/icon-object/glyph/task/16';
import Subtask16Icon from '@atlaskit/icon-object/glyph/subtask/16';
import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';
import Blog16Icon from '@atlaskit/icon-object/glyph/blog/16';
import Code16Icon from '@atlaskit/icon-object/glyph/code/16';
import Calendar16Icon from '@atlaskit/icon-object/glyph/calendar/16';
import NewFeature16Icon from '@atlaskit/icon-object/glyph/new-feature/16';

interface IssueTypeIconMap {
  [name: string]: ReactNode;
}

interface PriorityIconMap {
  [name: string]: ReactNode;
}

interface StatusCatecoryColorMap {
  [name: string]: string;
}

export const issuetypeIconMap: IssueTypeIconMap = {
  1: <Bug16Icon label="Bug" />,
  3: <Task16Icon label="Task" />,
  5: <Subtask16Icon label="Sub-task" />,
  10000: <Epic16Icon label="Epic" />,
  10001: <Story16Icon label="Story" />,
  10005: <Story16Icon label="Story" />,
  10006: <Task16Icon label="Task" />,
  10007: <Subtask16Icon label="Sub-task" />,
  10008: <Bug16Icon label="Bug" />,
  11700: <Blog16Icon label="Blog" />,
  12100: <Code16Icon label="Code" />,
  13600: <Calendar16Icon label="Calendar" />,
  15100: <NewFeature16Icon label="Feature" />,
};

export const priorityIconMap: PriorityIconMap = {
  10400: <PriorityBlockerIcon size="small" label="Blocker" />,
  10401: <PriorityCriticalIcon size="small" label="Critical" />,
  10402: <PriorityHighestIcon size="small" label="Highest" />,
  10403: <PriorityMediumIcon size="small" label="Medium" />,
  10404: <PriorityLowIcon size="small" label="Low" />,
  10405: <PriorityTrivialIcon size="small" label="Trivial" />,
};

export const statusCatecoryColorMap: StatusCatecoryColorMap = {
  2: 'grey',
  3: 'green',
  4: 'blue',
};
