import { ReactNode, ReactText } from 'react';

export interface Props {
  children: ReactNode;
  navigationViewController: { setView: (id: string) => void };
  issueId?: string;
  resourceId?: string;
}

export interface ResourceProps {
  navigationViewController: { setView: (id: string) => void };
  resourceId: string;
}

export interface FilterLinkProps {
  children: ReactNode;
  id: string;
  name: string;
}

export interface Issue {
  id: string;
  key: string;
  name: string;
  fields: IssueFields;
}

export interface IssuesStatus {
  name: string;
  category: string;
  statusCategory: IssueType;
}

interface Priority {
  id: string;
  key: string;
  name: string;
}

interface FixVersion {
  id: string;
  key: string;
  name: string;
}

export interface IssueFields {
  summary: string;
  status: IssuesStatus;
  issuetype: IssueType;
  priority: Priority;
  fixVersions: FixVersion[];
  assignee: Assignee;
}

export interface Assignee {
  id: string;
  key: string;
  displayName: string;
}

export interface RowProps {
  key: string;
  fields: IssueFields;
  children: Array<ReactNode>;
}

export interface Project extends IssueType {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  avatarUrls: {
    small: string;
    large: string;
  };
}

export interface ProjectListItem {
  id: string;
  avatar: string;
  pathname: string;
  text: string;
  subText: string;
}

export interface Resource {
  key: string;
  name: string;
  team: string;
  displayName: string;
}

export interface Absence {
  id: string;
  date: string;
}

export interface MockIssue {
  id: string;
  key: string;
  fields: { summary: string };
}
