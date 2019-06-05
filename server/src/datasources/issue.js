import { RESTDataSource } from 'apollo-datasource-rest'

export default class IssueAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `https://${process.env.HOST}/rest/`
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.auth)
    console.log({
      Authorization: this.context.auth,
    })
  }

  async getProjects() {
    const response = await this.get('api/latest/project/')

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
    }))

    return projects
  }

  async getVersions(projectId, startAt, maxResults) {
    const response = await this.get(`api/latest/project/${projectId}/version`, {
      startAt,
      maxResults,
      orderBy: 'name',
    })
    return Array.isArray(response.values) ? response.values : []
  }

  async getIssues(jql, startAt, maxResults) {
    const response = await this.post('api/latest/search', {
      jql,
      fields,
      startAt,
      maxResults,
    })
    const issues = Array.isArray(response.issues)
      ? response.issues.map(issue => this.issueReducer(issue))
      : []
    return { ...response, issues }
  }

  async getIssueById({ issueId }) {
    const response = await this.get(
      `api/latest/issue/${issueId}?fields=${fields.join()}`,
    )
    return this.issueReducer(response)
  }

  async editIssue(issueId, summary, assignee) {
    /**
     * TODO: Dynamically choose the fields to update according to the input data
     */
    if (summary) {
      this.put(`api/latest/issue/${issueId}`, { fields: { summary } })
    }
    if (assignee) {
      this.put(`api/latest/issue/${issueId}`, { fields: { assignee } })
    }
  }

  issueReducer = issue => ({
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
        (issue.fields.assignee &&
          this.context.resourceMap[issue.fields.assignee.key]) ||
        null,
    },
    reporter: {
      key: issue.fields.reporter && issue.fields.reporter.key,
      name: issue.fields.reporter && issue.fields.reporter.displayName,
    },
    comments:
      issue.fields.comment &&
      issue.fields.comment.comments.map(comment => ({
        id: comment.id,
        created: comment.created,
        updated: comment.updated,
        author: { key: comment.author.key, name: comment.author.displayName },
        body: comment.body,
      })),
    children:
      issue.fields.subtasks &&
      issue.fields.subtasks.map(subtask =>
        this.issueReducer(subtask, this.context.resourceMap),
      ),
    parent:
      issue.fields.customfield_10006 ||
      issue.fields.customfield_20700 ||
      issue.fields.customfield_10014,
  })
}

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
  'subtasks',
  'customfield_10006',
  'customfield_10014',
  'customfield_20700',
]
