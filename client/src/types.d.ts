import { ReactNode } from 'react';
import { QueryResult } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';

export declare interface Props extends RouteComponentProps {
  navigationViewController: { setView: (id: string) => void };
  issueId?: string;
  resourceId?: string;
}

export declare interface ResourceProps {
  navigationViewController: { setView: (id: string) => void };
  resourceId: string;
}

export declare interface FilterLinkProps {
  children: ReactNode;
  id: string;
  name: string;
}

export declare interface Issue {
  id: string;
  key: string;
  name: string;
  fields: IssueFields;
}

export declare interface IssueConnectionData extends QueryResult {
  issues: Issue[];
}

export declare interface IssueConnectionVars {
  issuetype: string;
}

export declare interface IssuesStatus {
  name: string;
  category: string;
  statusCategory: IssueType;
}

declare interface Priority {
  id: string;
  key: string;
  name: string;
}

declare interface FixVersion {
  id: string;
  key: string;
  name: string;
}

export declare interface IssueFields {
  summary: string;
  status: IssuesStatus;
  issuetype: IssueType;
  priority: Priority;
  fixVersions: FixVersion[];
  assignee: Assignee;
}

export declare interface Assignee {
  id: string;
  key: string;
  displayName: string;
}

export declare interface RowProps {
  key: string;
  fields: IssueFields;
  children: Array<ReactNode>;
}

export declare interface Project extends IssueType {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  avatarUrls: {
    small: string;
    large: string;
  };
}

export declare interface ProjectListItem {
  id: string;
  avatar: string;
  pathname: string;
  text: string;
  subText: string;
}

export declare interface Resource {
  key: string;
  name: string;
  team: string;
  displayName: string;
  position: string;
  phone: string;
  email: string;
  employeeId: string;
}

export declare interface Absence {
  id: string;
  date: string;
}

export declare interface MockIssue {
  id: string;
  key: string;
  fields: { summary: string };
}

export interface Team {
  id: string;
}
