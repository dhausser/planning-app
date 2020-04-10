import { ReactNode, Dispatch, SetStateAction } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { QueryResult } from '@apollo/client';
import { OptionType } from '@atlaskit/select';

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
  avatarUrls: {
    large: string;
    small: string;
    xsmall: string;
    medium: string;
  };
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

export declare interface Team {
  id: string;
}

export declare interface ModalInterfaceProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selection?: Dispatch<SetStateAction<string>>;
}

export declare interface NamePlateProps {
  id: string;
}

export declare interface FormTypes {
  firstname: string;
  lastname: string;
  position: OptionType;
  team: OptionType;
}

export declare interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export declare interface ModalProps {
  resources: Resource[];
  setSelection: React.Dispatch<React.SetStateAction<any>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export declare interface ResourceTableProps extends ModalProps {
  loading?: boolean;
  rowsPerPage?: number;
}

export declare interface InputValidation {
  (data: FormTypes, errors?: Record<string, string>):
    | Record<string, string>
    | undefined;
}

export declare interface ValidateOnSubmit {
  (data: FormTypes): Record<string, string> | undefined;
}
