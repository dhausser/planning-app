import { Filter, TreeTableData, Issue, TreeTableItem } from '../types';

class Roadmap {
  data: TreeTableData;
  fields: string[];
  maxResults: number;
  projectId: any;
  versionId: any;
  jql: string;
  constructor({ projectId, versionId }: Filter) {
    this.data = {};
    this.fields = [
      'summary',
      'status',
      'issuetype',
      'subtasks',
      'customfield_10006',
    ];
    this.maxResults = 50;
    this.projectId = projectId;
    this.versionId = versionId;
    this.jql = '';
  }

  getQuery() {
    this.jql = `(issuetype = Epic OR issueType in (Story, Task) AND "Epic Link" is not EMPTY)
    ${this.projectId ? `AND project = ${this.projectId} ` : ''}\
    ${this.versionId ? `AND fixVersion = ${this.versionId} ` : ''}\
    ORDER BY issuetype ASC, status DESC`;
  }

  getParams() {
    this.getQuery();
    return {
      jql: this.jql,
      fields: this.fields,
      maxResults: this.maxResults,
    };
  }

  addToBaseTree(issue: { key: string }) {
    Object.defineProperty(this.data, issue.key, {
      value: issue,
      enumerable: true,
    });
  }

  addToParent(issue: Issue) {
    const parent = issue.fields.customfield_10006;
    this.data[parent].children = [...this.data[parent].children];
    // this.data[parent].children = [issue, ...this.data[parent].children];
  }

  addToDataset(issue: Issue) {
    const { id } = issue.fields.issuetype;
    switch (id) {
      case '10000':
        this.addToBaseTree(issue);
        break;

      default:
        if (
          Object.prototype.hasOwnProperty.call(
            this.data,
            issue.fields.customfield_10006,
          )
        ) {
          this.addToParent(issue);
        } else {
          this.addToBaseTree(issue);
        }
    }
  }

  buildDataset(issues: Issue[]) {
    for (let i = 0; i < issues.length; i += 1) {
      const issue = { ...issues[i], children: issues[i].fields.subtasks };
      this.addToDataset(issue);
    }
  }

  getDataset(issues: Issue[]) {
    this.buildDataset(issues);
    return Object.values(this.data);
  }
};

export default Roadmap;
