import { RESTDataSource } from 'apollo-datasource-rest'

const fields = [
  'summary',
  'description',
  'status',
  'assignee',
  'reporter',
  'issuetype',
  'priority',
  'fixVersions',
  'comment',
  'subtasks',
];

export default class IssueAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.JIRA_URL;
  }

  willSendRequest(request) {
    request.headers.set('Authorization', process.env.AUTHORIZATION);
    request.params.set('notifyUsers', false);
  }

  async getAllVersions(projectId, pageSize, after) {
    const response = await this.get(`project/${projectId}/version`, {
      startAt: after,
      maxResults: pageSize,
      orderBy: 'name',
      status: 'unreleased',
    });
    return Array.isArray(response.values) ? response.values : [];
  }

  async getAllIssues(jql, pageSize, after) {
    const response = await this.post('search', {
      jql,
      fields,
      startAt: after,
      maxResults: pageSize,
    });
    const { startAt, maxResults, total } = response;
    const issues = Array.isArray(response.issues)
      ? response.issues.map(issue => this.issueReducer(issue))
      : [];
    return { startAt, maxResults, total, issues };
  }

  issueReducer(issue) {
    return {
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      priority: issue.fields.priority.name,
      type: issue.fields.issuetype.name,
      status: {
        id: issue.fields.status.id,
        name: issue.fields.status.name,
        category: issue.fields.status.statusCategory.key,
      },
      fixVersions: issue.fields.fixVersions,
      /**
       * TODO: Error handler for assignee == null
       */
      assignee: {
        id: issue.fields.assignee && issue.fields.assignee.key,
        name: issue.fields.assignee && issue.fields.assignee.displayName,
      },
      reporter: {
        id: issue.fields.reporter && issue.fields.reporter.key,
        name: issue.fields.reporter && issue.fields.reporter.displayName,
      },
      comments:
        issue.fields.comment &&
        issue.fields.comment.comments.map(comment => ({
          author: { id: comment.author.key, name: comment.author.displayName },
          body: comment.body,
        })),
      subtasks:
        issue.fields.subtasks &&
        issue.fields.subtasks.map(subtask => this.issueReducer(subtask)),
    };
  }

  async getIssueById({ issueId }) {
    const response = await this.get(`issue/${issueId}?fields=${fields.join()}`);
    return this.issueReducer(response);
  }

  async editIssue({ issueId, summary }) {
    this.put(`issue/${issueId}`, { fields: { summary } });
  }
}
