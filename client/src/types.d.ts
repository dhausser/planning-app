import { ReactNode, Dispatch, SetStateAction } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { QueryResult } from '@apollo/client';
import { OptionType } from '@atlaskit/select';

export interface Props extends RouteComponentProps {
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

export interface IssueList {
  startAt: number;
  maxResults: number;
  total: number;
  issues: Issue[];
}

export interface IssueConnectionData extends QueryResult {
  issues: IssueList;
}

export interface RoadmapIssueConnectionVars {
  issuetype: string;
}

export interface IssueConnectionVars {
  resourceId: string | undefined;
  startAt: number;
  maxResults: number;
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
  position: string;
  phone?: string;
  email?: string;
  employeeId?: string;
  avatarUrls: {
    large: string;
    small: string;
    xsmall: string;
    medium: string;
  };
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

export interface Team {
  id: string;
}

export interface ModalInterfaceProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selection: Resource;
}

export interface NamePlateProps {
  id: string;
}

export interface FormTypes {
  firstname: string;
  lastname: string;
  position: OptionType;
  team: OptionType;
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface ModalProps {
  resources: Resource[];
  setSelection: React.Dispatch<React.SetStateAction<Resource>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ResourceTableProps extends ModalProps {
  loading?: boolean;
  rowsPerPage?: number;
}

export interface InputValidation {
  (data: FormTypes, errors?: Record<string, string>):
    | Record<string, string>
    | undefined;
}

export interface ValidateOnSubmit {
  (data: FormTypes): Record<string, string> | undefined;
}
