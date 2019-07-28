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
    if (process.env.AUTH) {
      req.headers.set('Authorization', `Basic ${process.env.AUTH}`);
    } else {
      const { token } = this.context;
      req.headers.set('Authorization', this.oauth.sign(req, token));
    }
  }

  async getProjects() {
    const response = await this.get('/rest/api/2/project');
    const projects = response.map(project => ({
      ...project,
      projectTypeKey: `${project.projectTypeKey
        .charAt(0)
        .toUpperCase()}${project.projectTypeKey.slice(1)}`,
      avatarUrls: parseAvatarUrls(project.avatarUrls),
    }));
    return projects;
  }

  async getVersions(projectId, startAt, maxResults) {
    const response = await this.get(`/rest/api/2/project/${projectId}/version`, {
      startAt,
      maxResults,
      orderBy: 'name',
    });
    return Array.isArray(response.values) ? response.values : [];
  }

  async getIssues(projectId, versionId, teamId, resourceId, maxResults, startAt) {
    let assignee = resourceId;

    if (teamId) {
      const resources = await this.context.dataSources.resourceAPI.getResourcesByTeam({ teamId });
      assignee = resources.map(({ key }) => key);
    }

    const issues = new Issues({
      projectId,
      versionId,
      assignee,
      resourceMap: this.context.resourceMap,
      startAt,
      maxResults,
    });
    const response = await this.post('/rest/api/2/search', issues.getParams());

    return { ...response };
  }

  async getDashboardIssues({ projectId, versionId, teamId }) {
    const resources = teamId
      ? await this.context.dataSources.resourceAPI.getResourcesByTeam({ teamId })
      : await this.context.dataSources.resourceAPI.getResources();
    const assignee = resources.map(({ key }) => key);

    const dashboard = new Dashboard({
      projectId,
      versionId,
      teamId,
      assignee,
      resourceMap: this.context.resourceMap,
    });

    const response = await this.post('/rest/api/2/search', dashboard.getParams());

    return dashboard.getDataset(response);
  }

  async getRoadmapIssues(projectId, versionId) {
    const roadmap = new Roadmap({ projectId, versionId });
    const response = await this.post('/rest/api/2/search', roadmap.getParams());
    return roadmap.getDataset(response.issues);
  }

  async getIssueById(issueId) {
    const fields = [
      'summary', 'description', 'status', 'assignee', 'reporter', 'issuetype',
      'priority', 'fixVersions', 'comment',
    ];
    return this.get(`/rest/api/2/issue/${issueId}`, { fields });
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

  /* Mutations */
  editIssue({ id, value, type }) {
    this.put(`/rest/api/2/issue/${id}`, { fields: { [type]: value } });
  }
}

export default IssueAPI;
