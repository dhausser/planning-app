import { RESTDataSource } from 'apollo-datasource-rest'
import ResourceAPI from './resource'
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
  'customfield_20700',
]

export default class IssueAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = process.env.JIRA_URL
  }

  willSendRequest(request) {
    request.headers.set('Authorization', process.env.AUTHORIZATION)
    request.params.set('notifyUsers', false)
  }

  async getAllVersions(projectId, pageSize, after) {
    const response = await this.get(`project/${projectId}/version`, {
      startAt: after,
      maxResults: pageSize,
      orderBy: 'name',
      status: 'unreleased',
    })
    return Array.isArray(response.values) ? response.values : []
  }

  async getAllIssues(jql, pageSize, after) {
    const response = await this.post('search', {
      jql,
      fields,
      startAt: after,
      maxResults: pageSize,
    })
    const { startAt, maxResults, total } = response

    /**
     * TODO: Make a function => Resource Team Mapping
     */
    const resources = await ResourcesDAO.getResources()
    const teamMapping = resources.reduce(function(acc, cur) {
      acc[cur.key] = cur.team
      return acc
    }, {})

    const issues = Array.isArray(response.issues)
      ? response.issues.map(issue => this.issueReducer(issue, teamMapping))
      : []
    return { startAt, maxResults, total, issues }
  }

  issueReducer = (issue, teamMapping) => {
    let team = null
    if (issue.fields.assignee) {
      const { key } = issue.fields.assignee
      team = teamMapping[key]
    }

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
        id: issue.fields.assignee && issue.fields.assignee.key,
        key: issue.fields.assignee && issue.fields.assignee.key,
        name: issue.fields.assignee && issue.fields.assignee.displayName,
        team,
      },
      reporter: {
        id: issue.fields.reporter && issue.fields.reporter.key,
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
        issue.fields.subtasks.map(subtask => this.issueReducer(subtask)),
      parent: issue.fields.customfield_10006 || issue.fields.customfield_20700,
    }
  }

  async getIssueById({ issueId }) {
    /**
     * TODO: Make a function => Resource Team Mapping
     */
    const resources = await ResourcesDAO.getResources()
    const teamMapping = resources.reduce(function(acc, cur) {
      acc[cur.key] = cur.team
      return acc
    }, {})

    const response = await this.get(`issue/${issueId}?fields=${fields.join()}`)
    return this.issueReducer(response, teamMapping)
  }

  async editIssue({ issueId, summary }) {
    this.put(`issue/${issueId}`, { fields: { summary } })
  }
}
