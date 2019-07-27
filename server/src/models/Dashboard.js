/**
   * Fetch issues for barchart dashboard and aggregate by team or assignee
   * @param {String} projectId Project identifier
   * @param {String} versionId Version identifier
   * @param {String} teamId Team identifier
   * @param {String} maxResults Maximum number of issues to be fetched
   */

/**
 * TODOL Fix Network error: Cannot read property 'filter' of null
 * message: "Cannot read property 'fistname.lastname' of undefined",
 * locations: [ { line: 2, column: 3 } ],
 * path: [ 'dashboardIssues' ],
 * extensions: { code: 'INTERNAL_SERVER_ERROR', exception: { stacktrace: [Array] } }
 */

class Dashboard {
  constructor({
    projectId, versionId, teamId, assignee, resourceMap,
  }) {
    this.data = {};
    this.fields = ['assignee'];
    this.maxResults = 500;
    this.projectId = projectId;
    this.versionId = versionId;
    this.teamId = teamId;
    this.assignee = assignee;
    this.resourceMap = resourceMap;
    this.jql = '';
  }

  async getQuery() {
    this.jql = `statusCategory in (new, indeterminate)\
      ${this.projectId ? `AND project=${this.projectId}` : ''}\
      ${this.versionId ? `AND fixVersion=${this.versionId}` : ''}\
      ${this.assignee.length ? `AND assignee in (${this.assignee})` : ''}\
      order by priority`;
  }

  getParams() {
    this.getQuery();
    return {
      jql: this.jql,
      fields: this.fields,
      maxResults: this.maxResults,
    };
  }

  defineAggregationKey(issue) {
    const { key } = issue.fields.assignee;
    if (this.teamId) return key;
    return this.resourceMap[key];
  }

  incrementDatasetElement(key) {
    this.data[key] += 1;
  }

  inserElementToDataset(key) {
    Object.defineProperty(this.data, key, {
      value: 1,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  sumIssues(issues) {
    for (let i = 0; i < issues.length; i += 1) {
      const key = this.defineAggregationKey(issues[i]);

      if (Object.prototype.hasOwnProperty.call(this.data, key)) {
        this.incrementDatasetElement(key);
      } else {
        this.inserElementToDataset(key);
      }
    }
  }

  getDataset({ issues, total }) {
    this.sumIssues(issues);
    return {
      labels: Object.keys(this.data),
      values: Object.values(this.data),
      maxResults: this.maxResults,
      total,
    };
  }
}

export default Dashboard;
