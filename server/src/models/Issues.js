/**
 * Fetch issues for issues table
 * @param {String} projectId Project identifier
 * @param {String} versionId Version identifier
 * @param {String} teamId Team identifier
 * @param {String} resourceId Single resource identifier
 * @param {String} maxResults Maximum number of issues to be fetched
 * @param {String} startAt Starting index number of issues to be fetched
 */

class Issues {
  constructor({
    context, projectId, versionId, teamId, resourceId, startAt, maxResults,
  }) {
    this.context = context;
    this.projectId = projectId;
    this.versionId = versionId;
    this.teamId = teamId;
    this.resourceId = resourceId;
    this.startAt = startAt;
    this.maxResults = maxResults;
    this.assignee = null;
    this.fields = [
      'summary',
      'description',
      'status',
      'assignee',
      'reporter',
      'issuetype',
      'priority',
      'fixVersions',
      'comment',
    ];
    this.jql = this.getQueryString();
  }

  getParams() {
    return {
      jql: this.jql,
      fields: this.fields,
      startAt: this.startAt,
      maxResults: this.maxResults,
    };
  }

  async getAssignee(teamId, resourceId) {
    if (resourceId) {
      this.assignee = resourceId;
    } else if (teamId) {
      const resources = await this.context.dataSources.resourceAPI.getResourcesByTeam({ teamId });
      this.assignee = resources.map(({ key }) => key);
    }
  }

  getQueryString() {
    return `statusCategory in (new, indeterminate)\
      ${this.projectId ? `AND project=${this.projectId}` : ''}\
      ${this.versionId ? `AND fixVersion=${this.versionId}` : ''}\
      ${this.assignee ? `AND assignee in (${this.assignee})` : ''} order by priority desc`;
  }

  getIssues({ issues }) {
    return Array.isArray(issues)
      ? issues.map(issue => this.issueReducer(issue))
      : [];
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

export default Issues;
