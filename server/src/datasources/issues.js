import https from 'https'

export default class IssueAPI {
  getAllIssues(jql, pageSize, after) {
    return new Promise(function(resolve, reject) {
      let result

      const fields = [
        'summary',
        'description',
        'status',
        'assignee',
        'reporter',
        'issuetype',
        'priority',
        'fixVersions',
        'subtasks',
      ]

      const postData = JSON.stringify({
        jql: jql || `project=${process.env.PROJECT_ID}`,
        fields,
        startAt: after,
        maxResults: pageSize,
      })

      const options = {
        hostname: process.env.HOST,
        path: `${process.env.API_PATH}/search`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          Authorization: process.env.AUTHORIZATION,
        },
      }

      const req = https.request(options, res => {
        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', chunk => {
          rawData += chunk
        })

        res.on('end', () => {
          try {
            const response = JSON.parse(rawData)
            const { startAt, maxResults, total } = response
            const issues = Array.isArray(response.issues)
              ? response.issues.map(issue => issueReducer(issue))
              : []
            result = { startAt, maxResults, total, issues }
            resolve(result)
          } catch (err) {
            console.error(err.message)
          }
        })
      })

      req.on('error', e => {
        reject(console.error(`problem with request: ${e.message}`))
      })

      req.write(postData)
      req.end()
    })
  }

  getAllVersions(projectId, pageSize, after) {
    return new Promise(function(resolve, reject) {
      let response

      const options = {
        method: 'GET',
        hostname: process.env.HOST,
        path: `${
          process.env.API_PATH
        }/project/${projectId}/version?startAt=${after}&maxResults=${pageSize}&orderBy=name&status=unreleased`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: process.env.AUTHORIZATION,
        },
      }

      const req = https.request(options, res => {
        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', chunk => {
          rawData += chunk
        })

        res.on('end', () => {
          response = JSON.parse(rawData)
          resolve(Array.isArray(response.values) ? response.values : [])
        })
      })

      req.on('error', e => {
        reject(console.error(`problem with request: ${e.message}`))
      })

      req.end()
    })
  }
}

function issueReducer(issue) {
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
    /**
     * TODO: Error handler for assignee == null
     */
    assignee: {
      id: issue.fields.assignee && issue.fields.assignee.key,
      name: issue.fields.assignee && issue.fields.assignee.displayName,
    },
    reporter: {
      id: issue.fields.reporter && issue.fields.reporter.key,
      name: issue.fields.reporter && issue.fields.reporter.displayName,
    },
    comments:
      issue.fields.comment &&
      issue.fields.comment.comments.map(comment => ({
        author: { id: comment.author.key, name: comment.author.displayName },
        body: comment.body,
      })),
    subtasks:
      issue.fields.subtasks &&
      issue.fields.subtasks.map(subtask => this.issueReducer(subtask)),
  }
}
