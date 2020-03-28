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

export interface IssueType {
  id: string;
  key: string;
  name: string;
}

export interface IssuesStatus {
  name: string;
  statusCategory: IssueType;
}

export interface IssueFields {
  summary: string;
  status: IssuesStatus;
  issuetype: IssueType;
}

export interface RowProps {
  key: string;
  fields: IssueFields;
  children: Array<ReactNode>;
}

export interface Project extends IssueType {
  projectTypeKey: string;
  avatarUrls: { small: string };
}

export interface Resource {
  key: string;
  name: string;
  team: string;
}

export interface Absence {
  id: string;
  date: string;
}
