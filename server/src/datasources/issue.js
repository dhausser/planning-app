import { RESTDataSource } from 'apollo-datasource-rest';
import Issues from '../models/Issues';
import Dashboard from '../models/Dashboard';
import Roadmap from '../models/Roadmap';
import Oauth from '../models/Auth';

class IssueAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `https://${process.env.HOST}/rest/`;
    this.oauth = new Oauth(this.baseURL);
  }

  willSendRequest(req) {
    const { token } = this.context;
    req.headers.set('Authorization', this.oauth.sign(req, token));
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
    const issues = new Issues({
      context: this.context, projectId, versionId, teamId, resourceId, startAt, maxResults,
    });
    const response = await this.post('api/2/search', issues.getParams());

    return { ...response, issues: issues.getIssues(response) };
  }

  async getDashboardIssues(projectId, versionId, teamId) {
    const resources = teamId
      ? await this.context.dataSources.resourceAPI.getResourcesByTeam({ teamId })
      : await this.context.dataSources.resourceAPI.getResources();
    const assignee = resources.map(({ key }) => key);

    const dashboard = new Dashboard({
      projectId, versionId, teamId, assignee, resourceMap: this.context.resourceMap,
    });
    const { jql, fields, maxResults } = dashboard;

    const response = await this.post('api/latest/search', { jql, fields, maxResults });
    return dashboard.getDataset(response);
  }

  async getRoadmapIssues(projectId, versionId) {
    const roadmap = new Roadmap(projectId, versionId);
    const { jql, fields, maxResults } = roadmap;
    const response = await this.post('api/2/search', { jql, fields, maxResults });

    return roadmap.getRoadmapTree(response);
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
