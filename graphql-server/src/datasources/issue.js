/* eslint-disable class-methods-use-this */
const { RESTDataSource } = require('apollo-datasource-rest');
require('dotenv').config({ path: '.env' });

class IssueAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.JIRA_URL;
  }

  willSendRequest(request) {
    request.headers.set('Authorization', process.env.AUTHORIZATION);
  }

  async getAllIssues() {
    const response = await this.post('search', {
      jql: 'project = 10500 AND fixVersion=15900',
      fields: [
        'summary',
        'description',
        'status',
        'assignee',
        'creator',
        'issuetype',
        'priority',
        'fixVersions',
      ],
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
    };
  }

  async getIssueById({ issueId }) {
    const response = await this.get(
      `issue/${issueId}?fields=summary,assignee,reporter,status,issuetype,priority,description,fixVersions`
    );
    return this.issueReducer(response);
  }
}

module.exports = IssueAPI;
