import { RESTDataSource } from 'apollo-datasource-rest';
import { sign } from 'oauth-sign';
import { consumerKey, consumerSecret } from '../passport';

function aggregateByAssignee(issues) {
  return issues.reduce((resources, issue) => {
    if (issue.assignee && issue.assignee.displayName) {
      const firstName = issue.assignee.displayName.split(' ').shift();
      if (!resources[firstName]) {
        resources[firstName] = 0;
      }
      resources[firstName] += 1;
    }

    return resources;
  }, {});
}

function aggregateByTeam(issues) {
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

class IssueAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `https://${process.env.HOST}/rest/`;
  }

  willSendRequest(req) {
    req.headers.set('Authorization', this.baseURL === 'https://solarsystem.atlassian.net/rest/'
      ? `Basic ${process.env.AUTH}`
      : this.signRequest(req));
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
    const response = await this.get(`api/2/project/${projectId}/version`, {
      startAt,
      maxResults,
      orderBy: 'name',
    });

    return Array.isArray(response.values) ? response.values : [];
  }

  async getIssues(projectId, versionId, teamId, resourceId, maxResults, startAt) {
    let assignee = null;

    if (resourceId) {
      assignee = resourceId;
    } else if (teamId) {
      assignee = await this.context.dataSources.resourceAPI.getResourcesByTeam({ teamId });
      assignee = assignee.map(({ key }) => key);
    }

    const jql = `statusCategory in (new, indeterminate)\
    ${projectId ? `AND project=${projectId}` : ''}\
    ${versionId ? `AND fixVersion=${versionId}` : ''}\
    ${assignee ? `AND assignee in (${assignee})` : ''} order by priority desc`;

    const response = await this.post('api/2/search', {
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
      maxResults,
      startAt,
    });

    const issues = Array.isArray(response.issues)
      ? response.issues.map(issue => this.issueReducer(issue))
      : [];

    return { ...response, issues };
  }

  async getDashboardIssues(projectId, versionId, teamId, maxResults = 500) {
    /**
     * TODO: Stack by team member if teamId is specified
     */
    const teams = await this.context.dataSources.resourceAPI.getTeams();
    const resources = await this.context.dataSources.resourceAPI.getResources();
    const assignee = resources.map(({ key }) => key);

    assignee.push('admin');

    const jql = `statusCategory in (new, indeterminate)\
    ${projectId ? `AND project=${projectId}` : ''}\
    ${versionId ? `AND fixVersion=${versionId}` : ''}\
    ${assignee.length ? `AND assignee in (${assignee})` : ''} order by priority`;

    const response = await this.post('api/latest/search', {
      jql,
      fields: ['assignee'],
      maxResults,
    });

    const issues = Array.isArray(response.issues)
      ? response.issues.map(({ id, key, fields }) => ({
        id,
        key,
        assignee: fields.assignee && {
          ...fields.assignee,
          team: this.context.resourceMap[fields.assignee.key],
        },
      }))
      : [];

    // Make an object from the teams array
    const data = {};
    let { length } = teams;
    let i = 0;

    for (;i < length; i += 1) {
      data[teams[i].id] = 0;
    }

    // Iterate over issues and increment teams
    ({ length } = issues);
    i = 0;

    for (;i < length; i += 1) {
      if (data[issues[i].assignee.team]) {
        data[issues[i].assignee.team] += 1;
      }
    }

    // const data = teamId
    //   ? aggregateByAssignee(issues.filter(issue => issue.assignee.team === teamId))
    //   : aggregateByTeam(issues);

    return {
      ...response,
      labels: Object.keys(data),
      values: Object.values(data),
    };
  }

  async getRoadmapIssues(projectId, versionId) {
    const jql = `(issuetype = Epic OR issueType in (Story, Task) AND "Epic Link" is not EMPTY) AND status != closed
    ${projectId ? `AND project = ${projectId} ` : ''}\
    ${versionId ? `AND fixVersion = ${versionId} ` : ''}\
    ORDER BY issuetype ASC, status DESC`;

    const response = await this.post('api/2/search', {
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
      ? response.issues.map(({ key, fields }) => ({
        key,
        ...fields,
        children:
          fields.subtasks
          && fields.subtasks.map(issue => ({
            key: issue.key,
            ...issue.fields,
          })),
        parent:
          fields.customfield_10006
          || fields.customfield_20700
          || fields.customfield_10014,
      }))
      : [];

    issues
      .filter(({ issuetype }) => issuetype.id !== '10000')
      .forEach((issue) => {
        const parent = issues
          .filter(({ issuetype }) => issuetype.id === '10000')
          .find(epic => epic.key === issue.parent);
        if (parent) {
          parent.children.push(issue);
        }
      });

    return issues.filter(({ issuetype, children }) => (issuetype.id === '10000' && children.length));
  }

  async getIssueById(issueId) {
    const fields = [
      'summary', 'description', 'status', 'assignee', 'reporter', 'issuetype',
      'priority', 'fixVersions', 'comment',
    ];

    const response = await this.get(`api/2/issue/${issueId}`, { fields });

    return this.issueReducer(response);
  }

  editIssue(issueId, summary, assignee) {
    if (summary) {
      this.put(`api/2/issue/${issueId}`, { fields: { summary } });
    }
    if (assignee) {
      this.put(`api/2/issue/${issueId}`, { fields: { assignee } });
    }
  }

  issueReducer({ id, key, fields }) {
    return {
      id,
      key,
      ...fields,
      assignee: fields.assignee && {
        ...fields.assignee,
        team: this.context.resourceMap[fields.assignee.key],
      },
    };
  }
}

export default IssueAPI;
