import { PrismaClient } from '@prisma/client'

export interface Args {
  id: string;
  projectId: string;
  versionId: string;
  teamId: string;
  issuetypeId: string;
  statusId: string;
  resourceId: string;
  startAt: number;
  maxResults: number;
}

export interface Context {
  dataSources: {
    issueAPI: any;
    absenceAPI: any;
    resourceAPI: any;
    userAPI: any;
  };
}

export interface ApolloContext {
  prisma: PrismaClient
}

export interface UserInput {
  name: string;
  email: string;
  position: string;
  team: string;
}

export interface Project {
  projectTypeKey: string;
  avatarUrls: any;
}

export interface Filter {
  projectId: string;
  versionId: string;
  teamId?: string;
  assignee?: string;
}

export interface AvatarUrls {
  large: string;
  small: string;
  xsmall: string;
  medium: string;
  '48x48': string;
  '24x24': string;
  '16x16': string;
  '32x32': string;
}

export interface IssueConnection {
  projectId: string;
  issuetypeId: string;
  versionId: string;
  statusId: string;
  startAt: number;
  maxResults: number;
  assignee: Resource[],
  resourceMap: any,
  teamId?: string;
  resourceId?: string;
}


export interface Resource {
  id: string;
  key: string;
  email: string;
  name: string;
  position: string;
  team: string;
}

export interface ResourceInputs {
  id: string;
  firstname: string;
  lastname: string;
  position: string;
  team: string;
}

export interface AssignableUsers {
  username: string;
  project: string;
  issueKey: string;
  startAt: number;
  maxResults: number;
  actionDescriptorId: number;
}

export interface Issue {
  key: string
  fields: {
    issuetype: {
      id: string;
    }
    customfield_10006: string;
    subtasks: Issue[]
  }
}

export interface TreeTableItem {
  key: string;
  children: TreeTableItem[];
}

export interface TreeTableData {
  [key: string]: TreeTableItem;
}

export interface DashboardChartData {
  [key: string]: number;
}

export interface Pagination {
  offset: number;
  limit: number;
  teamId: string;
}
