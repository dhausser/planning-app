import { RESTDataSource } from 'apollo-datasource-rest';
import { sign } from 'oauth-sign';
import { consumerKey, consumerSecret } from '../passport';

function getIssuesQueryString({ projectId, versionId, assignee }) {
  return `statusCategory in (new, indeterminate)\
    ${projectId ? `AND project=${projectId}` : ''}\
    ${versionId ? `AND fixVersion=${versionId}` : ''}\
    ${assignee ? `AND assignee in (${assignee})` : ''} order by priority desc`;
}

function getDashboardQueryString({ projectId, versionId, assignee }) {
  return `statusCategory in (new, indeterminate)\
    ${projectId ? `AND project=${projectId}` : ''}\
    ${versionId ? `AND fixVersion=${versionId}` : ''}\
    ${assignee.length ? `AND assignee in (${assignee})` : ''}\
    order by priority`;
}

function getRoadmapQueryString({ projectId, versionId }) {
  return `(issuetype = Epic OR issueType in (Story, Task) AND "Epic Link" is not EMPTY) AND status != closed
  ${projectId ? `AND project = ${projectId} ` : ''}\
  ${versionId ? `AND fixVersion = ${versionId} ` : ''}\
  ORDER BY issuetype ASC, status DESC`;
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

  /**
   * Fetch all projects
   */
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

  /**
   * Fetch all version for project
   * @param {String} projectId Project identifier
   * @param {String} maxResults Maximum number of issues to be fetched
   * @param {String} startAt Starting index number of issues to be fetched
   */
  async getVersions(projectId, startAt, maxResults) {
    const response = await this.get(`api/2/project/${projectId}/version`, {
      startAt,
      maxResults,
      orderBy: 'name',
    });

    return Array.isArray(response.values) ? response.values : [];
  }

  /**
   * Fetch issues for issues table
   * @param {String} projectId Project identifier
   * @param {String} versionId Version identifier
   * @param {String} teamId Team identifier
   * @param {String} resourceId Single resource identifier
   * @param {String} maxResults Maximum number of issues to be fetched
   * @param {String} startAt Starting index number of issues to be fetched
   */
  async getIssues(projectId, versionId, teamId, resourceId, maxResults, startAt) {
    let assignee = null;

    if (resourceId) {
      assignee = resourceId;
    } else if (teamId) {
      assignee = await this.context.dataSources.resourceAPI.getResourcesByTeam({ teamId });
      assignee = assignee.map(({ key }) => key);
    }

    const response = await this.post('api/2/search', {
      jql: getIssuesQueryString({ projectId, versionId, assignee }),
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

  /**
   * Fetch issues for barchart dashboard and aggregate by team or assignee
   * @param {String} projectId Project identifier
   * @param {String} versionId Version identifier
   * @param {String} teamId Team identifier
   * @param {String} maxResults Maximum number of issues to be fetched
   */
  async getDashboardIssues(projectId, versionId, teamId, maxResults = 1000) {
    const resources = teamId
      ? await this.context.dataSources.resourceAPI.getResourcesByTeam({ teamId })
      : await this.context.dataSources.resourceAPI.getResources();
    const assignee = resources.map(({ key }) => key);

    const response = await this.post('api/latest/search', {
      jql: getDashboardQueryString({ projectId, versionId, assignee }),
      fields: ['assignee'],
      maxResults,
    });

    const { issues, total } = response;
    const data = this.sumIssues(issues, teamId);

    return {
      labels: Object.keys(data),
      values: Object.values(data),
      maxResults,
      total,
    };
  }

  /**
   * Fetch issues for roadmap table tree
   * @param {String} projectId Project identifier
   * @param {String} versionId Version identifier
   */
  async getRoadmapIssues(projectId, versionId) {
    const response = await this.post('api/2/search', {
      jql: getRoadmapQueryString({ projectId, versionId }),
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

  /**
   * Fetch single issue by id
   * @param {String} issueId Issue identifier
   */
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

  issueDashboardReducer(issues) {
    return Array.isArray(issues)
      ? issues.map(({ id, key, fields }) => ({
        id,
        key,
        assignee: fields.assignee && {
          ...fields.assignee,
          team: this.context.resourceMap[fields.assignee.key],
        },
      }))
      : [];
  }

  sumIssues(issues, teamId) {
    const data = {};
    const { length } = issues;
    let i = 0;

    for (; i < length; i += 1) {
      let { key } = issues[i].fields.assignee;
      if (!teamId) key = this.context.resourceMap[key];
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] += 1;
      } else if (key != null) {
        data[key] = 1;
      }
    }

    return data;
  }
}

export default IssueAPI;
