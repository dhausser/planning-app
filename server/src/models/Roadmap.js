/**
 * Fetch issues for roadmap table tree
 * @param {String} projectId Project identifier
 * @param {String} versionId Version identifier
 */

class Roadmap {
  constructor(projectId, versionId) {
    this.projectId = projectId;
    this.versionId = versionId;
    this.fields = ['summary', 'status', 'issuetype', 'subtasks', 'customfield_10006'];
    this.maxResults = 50;
    this.jql = this.getQueryString();
  }

  getQueryString() {
    return `(issuetype = Epic OR issueType in (Story, Task) AND "Epic Link" is not EMPTY)
    ${this.projectId ? `AND project = ${this.projectId} ` : ''}\
    ${this.versionId ? `AND fixVersion = ${this.versionId} ` : ''}\
    ORDER BY issuetype ASC, status DESC`;
  }

  // eslint-disable-next-line class-methods-use-this
  async getRoadmapTree(response) {
    const { issues, issues: { length } } = response;
    const data = {};
    let i = 0;

    for (; i < length; i += 1) {
      const issue = {
        ...issues[i],
        children: issues[i].fields.subtasks,
      };

      if (issue.fields.issuetype.id === '10000') {
        Object.defineProperty(data, issue.key, { value: issue, enumerable: true });
      }

      if (issue.fields.issuetype.id !== '10000') {
        const { customfield_10006: parent } = issue.fields;

        if (Object.prototype.hasOwnProperty.call(data, parent)) {
          data[parent].children = [issue, ...data[parent].children];
        } else {
          Object.defineProperty(data, issue.key, { value: issue, enumerable: true });
        }
      }
    }

    return Object.values(data);
  }
}

export default Roadmap;
