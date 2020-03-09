import { RESTDataSource } from 'apollo-datasource-rest';
import Issues from '../models/Issues';
import Dashboard from '../models/Dashboard';
import Roadmap from '../models/Roadmap';
import Oauth from '../models/Auth';

function parseAvatarUrls(avatarUrls) {
  return {
    large: avatarUrls['48x48'],
    small: avatarUrls['24x24'],
    xsmall: avatarUrls['16x16'],
    medium: avatarUrls['32x32'],
  };
}

class IssueAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `https://${process.env.HOST}`;
    this.oauth = new Oauth(this.baseURL);
  }

  willSendRequest(req) {
    req.headers.set('Authorization', this.oauth.sign(req, this.context.authorization));
  }

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

  async getVersions(projectIdOrKey) {
    const response = await this.get(`/rest/api/2/project/${projectIdOrKey}/versions`);
    const unreleased = response.filter((value) => value.released === false);
    return Array.isArray(response) ? unreleased : [];
  }

  async getStatuses(projectIdOrKey) {
    const response = await this.get(`/rest/api/2/project/${projectIdOrKey}/statuses`);
    const { statuses } = response[0];
    return Array.isArray(statuses) ? statuses : [];
  }

  async getIssues({
    projectId, statusId, versionId, teamId, resourceId, startAt, maxResults,
  }) {
    let assignee = resourceId;

    if (teamId) {
      const resources = await this.context.dataSources.ResourceDAO.getResourcesByTeam({ teamId });
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
    const response = await this.post('/rest/api/2/search', issues.getParams());

    return { ...response };
  }

  async getDashboardIssues({ projectId, versionId, teamId }) {
    const resources = teamId
      ? await this.context.dataSources.ResourcesDAO.getResourcesByTeam({ teamId })
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

  async getEpics(projectId, versionId) {
    const jql = `issuetype = epic${projectId ? ` and project = ${projectId}` : ''} ${versionId ? ` and fixversion = ${versionId}` : ''}`;
    const response = await this.post('/rest/api/2/search', { jql, fields: ['summary'] });
    return Array.isArray(response.issues) ? response.issues : [];
  }

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

  async getCurrentUser() {
    const user = await this.get('/rest/api/2/myself');
    return {
      ...user,
      avatarUrls: parseAvatarUrls(user.avatarUrls),
    };
  }

  async getUser(key) {
    const user = await this.get('/rest/api/2/user', { key });
    return {
      ...user,
      avatarUrls: parseAvatarUrls(user.avatarUrls),
    };
  }

  async getAssignableUsers({ project }) {
    const response = await this.get('rest/api/2/user/assignable/search', { project });
    return Array.isArray(response.users) || [];
  }

  /* Mutations */
  async editIssue({ id, value, type }) {
    return this.put(`/rest/api/2/issue/${id}`, { fields: { [type]: value } });
  }

  async assignIssue({ id, key }) {
    return this.put(`/rest/api/2/issue/${id}/assignee`, { name: key });
  }
}

export default IssueAPI;
