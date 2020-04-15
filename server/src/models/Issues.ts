import { IssueConnection } from '../types';

class Issues {
  projectId: any;
  issuetypeId: any;
  versionId: any;
  statusId: any;
  assignee: any;
  startAt: any;
  maxResults: any;
  resourceMap: any;
  fields: string[];
  jql: string;
  constructor({
    projectId,
    issuetypeId,
    statusId,
    versionId,
    assignee,
    resourceMap,
    startAt,
    maxResults,
  }: IssueConnection) {
    this.projectId = projectId;
    this.issuetypeId = issuetypeId;
    this.versionId = versionId;
    this.statusId = statusId;
    this.assignee = assignee;
    this.startAt = startAt;
    this.maxResults = maxResults;
    this.assignee = assignee;
    this.resourceMap = resourceMap;
    this.fields = [
      'summary',
      'description',
      'status',
      'assignee',
      'reporter',
      'issuetype',
      'priority',
      'fixVersions',
      'comment',
    ];
    this.jql = '';
  }

  getParams() {
    this.getQuery();
    return {
      jql: this.jql,
      fields: this.fields,
      startAt: this.startAt || 0,
      maxResults: this.maxResults || 50,
    };
  }

  getQuery() {
    this.jql = `${this.projectId ? `project=${this.projectId}` : ''}${
      this.issuetypeId ? ` AND issuetype=${this.issuetypeId}` : ''
      }${this.versionId ? ` AND fixVersion=${this.versionId}` : ''}${
      this.statusId ? ` AND status=${this.statusId}` : ''
      }${this.assignee ? ` AND assignee in (${this.assignee})` : ''}`;
  }
};

export default Issues;
