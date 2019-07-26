/**
   * Fetch issues for barchart dashboard and aggregate by team or assignee
   * @param {String} projectId Project identifier
   * @param {String} versionId Version identifier
   * @param {String} teamId Team identifier
   * @param {String} maxResults Maximum number of issues to be fetched
   */

class Dashboard {
  constructor({
    projectId, versionId, teamId, assignee, resourceMap,
  }) {
    this.dataset = {};
    this.fields = ['assignee'];
    this.maxResults = 50;
    this.projectId = projectId;
    this.versionId = versionId;
    this.teamId = teamId;
    this.assignee = assignee;
    this.resourceMap = resourceMap;
    this.jql = this.getQueryString();
  }

  getQueryString() {
    return `statusCategory in (new, indeterminate)\
      ${this.projectId ? `AND project=${this.projectId}` : ''}\
      ${this.versionId ? `AND fixVersion=${this.versionId}` : ''}\
      ${this.assignee.length ? `AND assignee in (${this.assignee})` : ''}\
      order by priority`;
  }

  sumIssues(issues) {
    const data = {};
    const { length } = issues;
    let i = 0;

    for (; i < length; i += 1) {
      let { key } = issues[i].fields.assignee;
      if (!this.teamId) key = this.resourceMap[key];
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] += 1;
      } else if (key != null) {
        data[key] = 1;
      }
    }

    return data;
  }

  getDataset({ issues, total }) {
    this.dataset = this.sumIssues(issues);

    return {
      labels: Object.keys(this.dataset),
      values: Object.values(this.dataset),
      maxResults: this.maxResults,
      total,
    };
  }
}

export default Dashboard;
