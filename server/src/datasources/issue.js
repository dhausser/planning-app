import { RESTDataSource } from 'apollo-datasource-rest';
import { sign } from 'oauth-sign';

class IssueAPI extends RESTDataSource {
  constructor({ consumerKey, consumerSecret }) {
    super();
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.baseURL = `https://${process.env.HOST}/rest/`;
  }

  willSendRequest(req) {
    req.headers.set('Authorization', this.signRequest(req));
  }

  signRequest(req) {
    // Initialize Oauth parameters
    const { token: oauthToken } = this.context;
    const { method, path, params } = req;
    const oauthVersion = '1.0';
    const signatureMethod = 'RSA-SHA1';
    const baseURI = `${this.baseURL}${path}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.random().toString(36).substring(2, 15);
    const requestParams = Object.fromEntries(params.entries());

    // Assemble Oauth parameters
    const oauthParams = {
      ...requestParams,
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: nonce,
      oauth_signature_method: signatureMethod,
      oauth_timestamp: timestamp,
      oauth_token: oauthToken,
      oauth_version: oauthVersion,
    };

    // Generate Oauth signature
    const oauthSignature = encodeURIComponent(sign(
      signatureMethod,
      method,
      baseURI,
      oauthParams,
      this.consumerSecret,
    ));

    // Compose Oauth authorization header
    return `OAuth\
    oauth_consumer_key="${this.consumerKey}",\
    oauth_nonce="${nonce}",\
    oauth_signature="${oauthSignature}",\
    oauth_signature_method="${signatureMethod}",\
    oauth_timestamp="${timestamp}",\
    oauth_token="${oauthToken}",\
    oauth_version="${oauthVersion}"`;
  }

  async getProjects() {
    const response = await this.get('api/latest/project');

    const projects = response.map(project => ({
      ...project,
      projectTypeKey: `${project.projectTypeKey
        .charAt(0)
        .toUpperCase()}${project.projectTypeKey.slice(1)}`,
      avatarUrls: {
        large: project.avatarUrls['48x48'],
        small: project.avatarUrls['24x24'],
        xsmall: project.avatarUrls['16x16'],
        medium: project.avatarUrls['32x32'],
      },
    }));

    return projects;
  }

  async getVersions(projectId, startAt, maxResults) {
    const response = await this.get(`api/latest/project/${projectId}/version`, {
      startAt,
      maxResults,
      orderBy: 'name',
    });
    return Array.isArray(response.values) ? response.values : [];
  }

  async getIssues(jql, startAt, maxResults) {
    const fields = [
      'summary', 'description', 'status', 'assignee', 'reporter', 'issuetype',
      'priority', 'fixVersions', 'comment', 'subtasks', 'customfield_10006',
      'customfield_10014', 'customfield_20700',
    ];

    const response = await this.post('api/latest/search', {
      jql,
      fields,
      startAt,
      maxResults,
    });

    const issues = Array.isArray(response.issues)
      ? response.issues.map(issue => this.issueReducer(issue))
      : [];
    return { ...response, issues };
  }

  async getDashboardIssues(jql, startAt, maxResults) {
    const fields = ['assignee'];

    const response = await this.post('api/latest/search', {
      jql,
      fields,
      startAt,
      maxResults,
    });

    const issues = Array.isArray(response.issues)
      ? response.issues.map(issue => this.dashboardIssueReducer(issue))
      : [];
    return { ...response, issues };
  }

  async getRoadmapIssues(jql, startAt, maxResults) {
    const fields = [
      'summary', 'status', 'assignee', 'issuetype',
      'priority', 'fixVersions', 'subtasks', 'customfield_10006',
      'customfield_10014', 'customfield_20700',
    ];

    const response = await this.post('api/latest/search', {
      jql,
      fields,
      startAt,
      maxResults,
    });

    const issues = Array.isArray(response.issues)
      ? response.issues.map(issue => this.roadmapIssueReducer(issue))
      : [];
    return { ...response, issues };
  }

  async getIssueById({ issueId }) {
    const fields = [
      'summary', 'description', 'status', 'assignee', 'reporter', 'issuetype',
      'priority', 'fixVersions', 'comment',
    ];

    const response = await this.get(`api/latest/issue/${issueId}`, {
      fields,
    });

    return this.issueReducer(response);
  }

  editIssue(issueId, summary, assignee) {
    if (summary) {
      this.put(`api/latest/issue/${issueId}`, { fields: { summary } });
    }
    if (assignee) {
      this.put(`api/latest/issue/${issueId}`, { fields: { assignee } });
    }
  }

  dashboardIssueReducer(issue) {
    return {
      id: issue.id,
      key: issue.key,
      assignee: {
        key: issue.fields.assignee && issue.fields.assignee.key,
        name: issue.fields.assignee && issue.fields.assignee.displayName,
        team:
          (issue.fields.assignee
            && this.context.resourceMap[issue.fields.assignee.key])
          || null,
      },
    };
  }

  roadmapIssueReducer(issue) {
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
      assignee: {
        key: issue.fields.assignee && issue.fields.assignee.key,
        name: issue.fields.assignee && issue.fields.assignee.displayName,
        team:
          (issue.fields.assignee
            && this.context.resourceMap[issue.fields.assignee.key])
          || null,
      },
      children:
        issue.fields.subtasks
        && issue.fields.subtasks.map(subtask => (
          this.issueReducer(subtask, this.context.resourceMap)
        )),
      parent:
        issue.fields.customfield_10006
        || issue.fields.customfield_20700
        || issue.fields.customfield_10014,
    };
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
      description: issue.fields.description,
      assignee: {
        key: issue.fields.assignee && issue.fields.assignee.key,
        name: issue.fields.assignee && issue.fields.assignee.displayName,
        team:
          (issue.fields.assignee
            && this.context.resourceMap[issue.fields.assignee.key])
          || null,
      },
      reporter: {
        key: issue.fields.reporter && issue.fields.reporter.key,
        name: issue.fields.reporter && issue.fields.reporter.displayName,
      },
      comments:
        issue.fields.comment
        && issue.fields.comment.comments.map(comment => ({
          id: comment.id,
          created: comment.created,
          updated: comment.updated,
          author: { key: comment.author.key, name: comment.author.displayName },
          body: comment.body,
        })),
      children:
        issue.fields.subtasks
        && issue.fields.subtasks.map(subtask => (
          this.issueReducer(subtask, this.context.resourceMap)
        )),
      parent:
        issue.fields.customfield_10006
        || issue.fields.customfield_20700
        || issue.fields.customfield_10014,
    };
  }
}

export default IssueAPI;
