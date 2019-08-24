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
    context, projectId, statusId, versionId, assignee, resourceMap, startAt, maxResults,
  }) {
    this.context = context;
    this.projectId = projectId;
    this.versionId = versionId;
    this.statusId = statusId;
    this.assignee = assignee;
    this.startAt = startAt;
    this.maxResults = maxResults;
    this.assignee = assignee;
    this.resourceMap = resourceMap;
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
    this.jql = '';
  }

  getParams() {
    this.getQuery();
    return {
      jql: this.jql,
      fields: this.fields,
      startAt: this.startAt,
      maxResults: this.maxResults,
    };
  }

  getQuery() {
    this.jql = `statusCategory in (${this.statusId ? this.statusId : 'new, indeterminate'})\
      ${this.projectId ? `AND project=${this.projectId}` : ''}\
      ${this.versionId ? `AND fixVersion=${this.versionId}` : ''}\
      ${this.assignee ? `AND assignee in (${this.assignee})` : ''} order by priority`;
  }
}

export default Issues;
