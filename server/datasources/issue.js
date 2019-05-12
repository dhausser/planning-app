import { RESTDataSource } from 'apollo-datasource-rest'
import ResourcesDAO from '../dao/resourcesDAO'

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

export default class IssueAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = process.env.JIRA_URL
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
    // request.headers.set('Content-Type', 'application/json')
  }

  async loginUser(username, password) {
    const response = await this.get(`auth/1/session`)
    // const responsePost = await this.post(`auth/1/session`, {
    //   username,
    //   password,
    // })
    console.log(response)
    return `${username}:${password}`
  }

  async getAllProjects() {
    const response = await this.get('api/latest/project/')
    return response
  }

  async getAllVersions(projectId, pageSize, after) {
    const response = await this.get(`api/latest/project/${projectId}/version`, {
      startAt: after,
      maxResults: pageSize,
      orderBy: 'name',
      status: 'unreleased',
    })
    return Array.isArray(response.values) ? response.values : []
  }

  async getAllIssues(jql, pageSize, after) {
    const response = await this.post('api/latest/search', {
      jql,
      fields,
      startAt: after,
      maxResults: pageSize,
    })
    const { startAt, maxResults, total } = response
    const teamMapping = await this.teamMapping()
    const issues = Array.isArray(response.issues)
      ? response.issues.map(issue => this.issueReducer(issue, teamMapping))
      : []
    return { startAt, maxResults, total, issues }
  }

  async getIssueById({ issueId }) {
    const teamMapping = await this.teamMapping()
    const response = await this.get(
      `api/latest/issue/${issueId}?fields=${fields.join()}`,
    )
    return this.issueReducer(response, teamMapping)
  }

  async editIssue(issueId, summary) {
    this.put(`api/latest/issue/${issueId}`, { fields: { summary } })
  }

  issueReducer = (issue, teamMapping) => ({
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
        (issue.fields.assignee && teamMapping[issue.fields.assignee.key]) ||
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
        this.issueReducer(subtask, teamMapping),
      ),
    parent:
      issue.fields.customfield_10006 ||
      issue.fields.customfield_20700 ||
      issue.fields.customfield_10014,
  })

  teamMapping = async () => {
    const resources = await ResourcesDAO.getResources()
    const teamMapping = resources.reduce(function(acc, cur) {
      acc[cur.key] = cur.team
      return acc
    }, {})
    return teamMapping
  }
}
