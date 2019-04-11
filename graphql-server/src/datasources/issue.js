const { RESTDataSource } = require('apollo-datasource-rest');
require('dotenv').config({ path: '.env' });

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
];

class IssueAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.JIRA_URL;
  }

  willSendRequest(request) {
    request.headers.set('Authorization', process.env.AUTHORIZATION);
  }

  async getAllIssues(jql, pageSize, after) {
    console.log(jql);
    const response = await this.post('search', {
      jql,
      fields,
      maxResults: pageSize,
    });
    return Array.isArray(response.issues)
      ? response.issues.map(issue => this.issueReducer(issue))
      : [];
  }

  issueReducer(issue) {
    return {
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      priority: issue.fields.priority.name,
      status: {
        id: issue.fields.status.id,
        name: issue.fields.status.name,
        category: issue.fields.status.statusCategory.key,
      },
      fixVersion: {
        id: issue.fields.fixVersions[0].id,
        name: issue.fields.fixVersions[0].name,
      },
      assignee: {
        id: issue.fields.assignee.key,
        name: issue.fields.assignee.displayName,
      },
      reporter: {
        id: issue.fields.reporter.key,
        name: issue.fields.reporter.displayName,
      },
      comments: issue.fields.comment.comments.map(comment => ({
        author: { id: comment.author.key, name: comment.author.displayName },
        body: comment.body,
      })),
    };
  }

  async getIssueById({ issueId }) {
    const response = await this.get(`issue/${issueId}?fields=${fields.join()}`);
    return this.issueReducer(response);
  }

  async editIssue({ issueId, summary }) {
    const body = { fields: { summary } };

    let response = null;
    try {
      response = await this.put(`issue/${issueId}`, body);
    } catch (error) {
      console.error(error);
    }

    return response;
  }
}

module.exports = IssueAPI;
