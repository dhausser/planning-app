import React from "react"
import Tooltip from "@atlaskit/tooltip"

// Import Priority Icons
import PriorityBlockerIcon from "@atlaskit/icon-priority/glyph/priority-blocker"
import PriorityCriticalIcon from "@atlaskit/icon-priority/glyph/priority-critical"
import PriorityHighestIcon from "@atlaskit/icon-priority/glyph/priority-highest"
import PriorityMediumIcon from "@atlaskit/icon-priority/glyph/priority-medium"
import PriorityLowIcon from "@atlaskit/icon-priority/glyph/priority-low"
import PriorityTrivialIcon from "@atlaskit/icon-priority/glyph/priority-trivial"

// Import Status Icons
import Epic16Icon from "@atlaskit/icon-object/glyph/epic/16"
import Story16Icon from "@atlaskit/icon-object/glyph/story/16"
import Task16Icon from "@atlaskit/icon-object/glyph/task/16"
import Subtask16Icon from "@atlaskit/icon-object/glyph/subtask/16"
import Bug16Icon from "@atlaskit/icon-object/glyph/bug/16"
import Blog16Icon from "@atlaskit/icon-object/glyph/blog/16"
import Code16Icon from "@atlaskit/icon-object/glyph/code/16"
import Calendar16Icon from "@atlaskit/icon-object/glyph/calendar/16"
import NewFeature16Icon from "@atlaskit/icon-object/glyph/new-feature/16"

export const issuetypeIconMap = {
  1: (
    <Tooltip content="Bug">
      <Bug16Icon />
    </Tooltip>
  ),
  3: (
    <Tooltip content="Task">
      <Task16Icon />
    </Tooltip>
  ),
  5: (
    <Tooltip content="Sub-task">
      <Subtask16Icon />
    </Tooltip>
  ),
  10000: (
    <Tooltip content="Epic">
      <Epic16Icon />
    </Tooltip>
  ),
  10001: (
    <Tooltip content="Story">
      <Story16Icon />
    </Tooltip>
  ),
  /**
   * Jira Cloud
   */
  10005: (
    <Tooltip content="Story">
      <Story16Icon />
    </Tooltip>
  ),
  10006: (
    <Tooltip content="Task">
      <Task16Icon />
    </Tooltip>
  ),
  10007: (
    <Tooltip content="Sub-task">
      <Subtask16Icon />
    </Tooltip>
  ),
  10008: (
    <Tooltip content="Bug">
      <Bug16Icon />
    </Tooltip>
  ),
  /**
   * Custom Issuetypes
   */
  11700: (
    <Tooltip content="Feedback">
      <Blog16Icon />
    </Tooltip>
  ),
  12100: (
    <Tooltip content="Backend">
      <Code16Icon />
    </Tooltip>
  ),
  13600: (
    <Tooltip content="Live Event">
      <Calendar16Icon />
    </Tooltip>
  ),
  15100: (
    <Tooltip content="Product">
      <NewFeature16Icon />
    </Tooltip>
  ),
}

export const priorityIconMap = {
  10400: (
    <Tooltip content="Outage">
      <PriorityBlockerIcon size="small" label="label" />
    </Tooltip>
  ),
  10401: (
    <Tooltip content="Problem">
      <PriorityCriticalIcon size="small" label="label" />
    </Tooltip>
  ),
  10402: (
    <Tooltip content="Must">
      <PriorityHighestIcon size="small" label="label" />
    </Tooltip>
  ),
  10403: (
    <Tooltip content="Should">
      <PriorityMediumIcon size="small" label="label" />
    </Tooltip>
  ),
  10404: (
    <Tooltip content="Could">
      <PriorityLowIcon size="small" label="label" />
    </Tooltip>
  ),
  10405: (
    <Tooltip content="Won't">
      <PriorityTrivialIcon size="small" label="label" />
    </Tooltip>
  ),
}

export const statusCatecoryColorMap = {
  2: "grey",
  3: "green",
  4: "blue",
}

export default {
  // Status colors
  new: "blue",
  indeterminate: "yellow",
  done: "green",

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
  "Sub-task": (
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
  "Live Event": (
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
}
