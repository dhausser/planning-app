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

export function getStatusColor(category) {
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

export function getPriorityIcon(priority) {
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

export function getTypeIcon(type) {
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

export function convertIssues(issues) {
  issues.map(issue => ({
    type: getTypeIcon(issue.fields.issuetype.name),
    key: issue.key,
    summary: issue.fields.summary,
    value: getPriorityIcon(issue.fields.priority.name),
    status: (
      <Status
        text={issue.fields.status.name}
        color={getStatusColor(issue.fields.status.statusCategory.key)}
      />
    ),
    children: issue.children.map(child => ({
      type: getTypeIcon(child.fields.issuetype.name),
      key: child.key,
      summary: child.fields.summary,
      value: getPriorityIcon(child.fields.priority.name),
      status: (
        <Status
          text={child.fields.status.name}
          color={getStatusColor(child.fields.status.statusCategory.key)}
        />
      ),
      // TODO: Subtask current do not have the flatten formatting as other issues
      children: child.fields.subtasks.map(subtask => ({
        type: getTypeIcon(subtask.fields.issuetype.name),
        key: subtask.key,
        summary: subtask.fields.summary,
        value: getPriorityIcon(subtask.fields.priority.name),
        status: (
          <Status
            text={subtask.fields.status.name}
            color={getStatusColor(subtask.fields.status.statusCategory.key)}
          />
        ),
        children: [],
      })),
    })),
  }));
}

export const getIssues = async (data = {}) =>
  (await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })).json();
