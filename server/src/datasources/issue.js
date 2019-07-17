import { RESTDataSource } from 'apollo-datasource-rest';
import { sign } from 'oauth-sign';
import { consumerKey, consumerSecret } from '../passport';

class IssueAPI extends RESTDataSource {
  constructor() {
    super();
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
      oauth_consumer_key: consumerKey,
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
      consumerSecret,
    ));

    // Compose Oauth authorization header
    return `OAuth\
      oauth_consumer_key="${consumerKey}",\
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

    if (process.env.PLATFORM === 'cloud') return response;
    return Array.isArray(response.values) ? response.values : [];
  }

  async getIssues(projectId, versionId, teamId, resourceId, startAt, maxResults) {
    let assignee = null;
    if (resourceId) {
      assignee = resourceId;
    } else if (teamId) {
      assignee = await this.context.dataSources.resourceAPI.getResourcesByTeam({ teamId });
      assignee = assignee.map(({ key }) => key);
    }

    /**
     * TODO: List of issues is not ordered by priority on single resource page
     */
    const jql = `statusCategory in (new, indeterminate)\
    ${projectId ? `AND project=${projectId}` : ''}\
    ${versionId ? `AND fixVersion=${versionId}` : ''}\
    ${assignee ? `AND assignee in (${assignee})` : ''} order by priority desc`;

    const response = await this.post('api/latest/search', {
      jql,
      fields: [
        'summary',
        'description',
        'status',
        'assignee',
        'reporter',
        'issuetype',
        'priority',
        'fixVersions',
        'comment',
      ],
    });

    const issues = Array.isArray(response.issues)
      ? response.issues.map(issue => this.issueReducer(issue))
      : [];
    return { ...response, issues };
  }

  aggregateByAssignee(issues) {
    const { context } = this;

    return issues.reduce((resources, issue) => {
      if (issue.assignee && issue.assignee.name) {
        const name = issue.assignee.name.split(' ').shift();
        if (!resources[name]) {
          resources[name] = 0;
        }
        resources[name] += 1;
      }

      return resources;
    }, {});
  }

  aggregateByTeam(issues) {
    const teams = this.context.dataSources.resourceAPI.getTeams();

    return issues.reduce((teams, issue) => {
      if (issue.assignee && issue.assignee.team) {
        const { team: teamName } = issue.assignee;
        if (!teams[teamName]) {
          teams[teamName] = 0;
        }
        teams[teamName] += 1;
      }

      return teams;
    }, {});
  }

  filterByTeam(issues, team) {
    const { context } = this;

    return team
      ? this.aggregateByAssignee(
        issues.filter(({ assignee }) => assignee.team === team.name),
      )
      : this.aggregateByTeam(issues);
  }

  async getDashboardIssues(projectId, versionId, teamId, maxResults = 1000) {
    const jql = `statusCategory in (new, indeterminate)\
    ${projectId ? `AND project=${projectId}` : ''}\
    ${versionId ? `AND fixVersion=${versionId}` : ''}`;

    const response = await this.post('api/latest/search', {
      jql,
      fields: ['assignee'],
      maxResults,
    });

    const issues = Array.isArray(response.issues)
      ? response.issues.map(issue => this.dashboardIssueReducer(issue))
      : [];
    return { ...response, issues };
  }

  async getRoadmapIssues(projectId, versionId) {
    const jql = `(issuetype = Epic OR issueType in (Story, Task) AND "Epic Link" is not EMPTY) AND status != closed
    ${projectId ? `AND project = ${projectId} ` : ''}\
    ${versionId ? `AND fixVersion = ${versionId} ` : ''}\
    ORDER BY issuetype ASC, status DESC`;

    const response = await this.post('api/latest/search', {
      jql,
      fields: [
        'summary',
        'status',
        'assignee',
        'issuetype',
        'priority',
        'fixVersions',
        'subtasks',
        'customfield_10006',
      ],
      maxResults: 250,
    });

    const issues = Array.isArray(response.issues)
      ? response.issues.map(issue => this.roadmapIssueReducer(issue))
      : [];

    issues
      .filter(({ type }) => type !== 'Epic')
      .forEach((issue) => {
        const parent = issues
          .filter(({ type }) => type === 'Epic')
          .find(epic => epic.key === issue.parent);
        if (parent) {
          parent.children.push(issue);
        }
      });

    return issues.filter(({ type, children }) => type === 'Epic' && children.length);
  }

  async getIssueById(issueId) {
    const fields = [
      'summary', 'description', 'status', 'assignee', 'reporter', 'issuetype',
      'priority', 'fixVersions', 'comment',
    ];

    const response = await this.get(`api/latest/issue/${issueId}`, { fields });

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
