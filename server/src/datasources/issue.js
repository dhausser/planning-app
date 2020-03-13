const { RESTDataSource } = require('apollo-datasource-rest');
const Issues = require('../models/Issues');
const Dashboard = require('../models/Dashboard');
const Roadmap = require('../models/Roadmap');
const Oauth = require('../models/Auth');

function parseAvatarUrls(avatarUrls) {
  return {
    large: avatarUrls['48x48'],
    small: avatarUrls['24x24'],
    xsmall: avatarUrls['16x16'],
    medium: avatarUrls['32x32'],
  };
}

module.exports = class IssueAPI extends RESTDataSource {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.baseURL = `https://${process.env.HOST}`;
    this.oauth = new Oauth(this.baseURL);
  }

  /**
   * Sign request before sending
   * @param {object} req - request object
   */
  willSendRequest(req) {
    req.headers.set('Authorization', this.oauth.sign(req, this.context.authorization));
  }

  /**
   * Get projects
   */
  async getProjects() {
    const response = await this.get('/rest/api/2/project');
    const projects = response.map((project) => ({
      ...project,
      projectTypeKey: `${project.projectTypeKey
        .charAt(0)
        .toUpperCase()}${project.projectTypeKey.slice(1)}`,
      avatarUrls: parseAvatarUrls(project.avatarUrls),
    }));
    return projects;
  }

  /**
   * Get versions
   * @param {string} projectIdOrKey - project ID or key
   */
  async getVersions(projectIdOrKey) {
    const response = await this.get(`/rest/api/2/project/${projectIdOrKey}/versions`);
    const unreleased = response.filter((value) => value.released === false);
    return Array.isArray(response) ? unreleased : [];
  }

  /**
   * Get statuses
   * @param {string} projectIdOrKey - project ID or key
   */
  async getStatuses(projectIdOrKey) {
    const response = await this.get(`/rest/api/2/project/${projectIdOrKey}/statuses`);
    const { statuses } = response[0];
    return Array.isArray(statuses) ? statuses : [];
  }

  /**
   * Get issues
   * @param {string} projectId - project ID
   * @param {string} versionId - version ID
   * @param {string} statusId - status ID
   * @param {string} teamId - team ID
   * @param {string} resourceId - resource ID
   * @param {int} startAt - start value
   * @param {int} maxResults - max results returned
   */
  async getIssues({
    projectId,
    versionId,
    statusId,
    teamId,
    resourceId,
    startAt,
    maxResults,
  }) {
    console.log({
      projectId,
      versionId,
      statusId,
      teamId,
      resourceId,
    });

    let assignee = resourceId;

    if (teamId) {
      const resources = await this.context.dataSources.ResourceDAO.getResourcesByTeam(teamId);
      assignee = resources.map(({ key }) => key);
    }

    const issues = new Issues({
      projectId,
      statusId,
      versionId,
      assignee,
      resourceMap: this.context.resourceMap, // undefined
      startAt,
      maxResults,
    });

    const params = issues.getParams();

    console.log({ params });

    const response = await this.post('/rest/api/2/search', params);

    return { ...response };
  }

  /**
   * Get dashboard issues
   * @param {string} projectId - project ID
   * @param {string} versionId - version ID
   * @param {string} teamId - team ID
   */
  async getDashboardIssues({ projectId, versionId, teamId }) {
    const resources = teamId
      ? await this.context.dataSources.ResourcesDAO.getResourcesByTeam(teamId)
      : await this.context.dataSources.ResourcesDAO.getResources();

    const assignee = resources.map(({ key }) => key) || [];

    const dashboard = new Dashboard({
      projectId,
      versionId,
      teamId,
      assignee,
    });

    const response = await this.post('/rest/api/2/search', dashboard.getParams());
    const resourceMap = await this.context.dataSources.ResourcesDAO.getResourceMap();

    return dashboard.getDataset(response, resourceMap);
  }

  async getRoadmapIssues(projectId, versionId) {
    const roadmap = new Roadmap({ projectId, versionId });
    const response = await this.post('/rest/api/2/search', roadmap.getParams());
    return roadmap.getDataset(response.issues);
  }

  /**
   * Get epics
   * @param {string} projectId - project ID
   * @param {string} versionId - version ID
   */
  async getEpics(projectId, versionId) {
    const jql = `issuetype = epic${projectId ? ` and project = ${projectId}` : ''} ${versionId ? ` and fixversion = ${versionId}` : ''}`;
    const response = await this.post('/rest/api/2/search', { jql, fields: ['summary'] });
    return Array.isArray(response.issues) ? response.issues : [];
  }

  /**
   * Get issue
   * Returns a full representation of the issue for the given issue key.
   * @param {string} issueId - issue ID or key
   * @param {string} fields - the list of fields to return for the issue.
   * By default, all fields are returned.
   * @param {string} expand - the list of fields to return for the issue.
   * @param {string} properties - the list of properties to return for the issue.
   * By default no properties are returned.
   * @param {boolean} updateHistory - the list of fields to return for the issue.
   */
  async getIssueById(issueId) {
    const fields = [
      'summary', 'description', 'status', 'assignee', 'reporter', 'issuetype',
      'priority', 'fixVersions', 'comment',
    ];
    const issue = await this.get(`/rest/api/2/issue/${issueId}`, { fields });
    const { assignee, reporter } = issue.fields;
    if (assignee) {
      assignee.avatarUrls = parseAvatarUrls(assignee.avatarUrls);
    }
    if (reporter) {
      reporter.avatarUrls = parseAvatarUrls(reporter.avatarUrls);
    }
    return issue;
  }

  /**
   * Get user
   * Returns currently logged user. This resource cannot be accessed anonymously.
   */
  async getCurrentUser() {
    const user = await this.get('/rest/api/2/myself');
    return {
      ...user,
      avatarUrls: parseAvatarUrls(user.avatarUrls),
    };
  }

  /**
   * Get user
   * Returns a user. This resource cannot be accessed anonymously.
   * @param {string} username - the username
   * @param {string} key - user key
   */
  async getUser(key) {
    const user = await this.get('/rest/api/2/user', { key });
    return {
      ...user,
      avatarUrls: parseAvatarUrls(user.avatarUrls),
    };
  }

  /**
   * Find assignable users
   * Returns a list of users that match the search string.
   * This resource cannot be accessed anonymously.
   * Please note that this resource should be called with an issue key when
   * a list of assignable users is retrieved for editing.
   * For create only a project key should be supplied.
   * The list of assignable users may be incorrect if it's called with the project key for editing.
   * @param {string} username - the username
   * @param {string} project - the key of the project we are finding assignable users for
   * @param {string} issueKey - the issue key for the issue being edited we need to
   * find assignable users for.
   * @param {int} [startAt] - the index of the first user to return (0-based)
   * @param {int} [maxResults] - the maximum number of users to return (defaults to 50).
   * The maximum allowed value is 1000.
   * If you specify a value that is higher than this number, your search results will be truncated.
   * @param {int} [actionDescriptorId]
   */
  async getAssignableUsers({
    username,
    project,
    issueKey,
    startAt,
    maxResults,
    actionDescriptorId,
  }) {
    console.log({
      username,
      project,
      issueKey,
      startAt,
      maxResults,
      actionDescriptorId,
    });
    const response = await this.get('rest/api/2/user/assignable/search', { project });
    return Array.isArray(response.users) || [];
  }

  /* Mutations */

  /**
   * Edit issue
   * Edits an issue from a JSON representation.
   * @param {string} issueIdOrKey - issue ID or key
   * @param {string} value - value to be updated
   * @param {string} type - name of field to update
   */
  async editIssue({ id, value, type }) {
    return this.put(`/rest/api/2/issue/${id}`, { fields: { [type]: value } });
  }

  /**
   * Assign
   * Assigns an issue to a user.
   * @param {string} param0 - issue ID or key
   * @param {key} param0 - user key
   */
  async assignIssue({ id, key }) {
    return this.put(`/rest/api/2/issue/${id}/assignee`, { name: key });
  }
};
