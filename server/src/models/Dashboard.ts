import { Filter, DashboardChartData } from '../types';

class Dashboard {
  data: DashboardChartData;
  fields: string[];
  maxResults: number;
  projectId: string;
  versionId: string;
  teamId: string;
  assignee: string;
  jql: string;
  constructor({
    projectId, versionId, teamId, assignee,
  }: Filter) {
    this.data = {};
    this.fields = ['assignee'];
    this.maxResults = 1500;
    this.projectId = projectId;
    this.versionId = versionId;
    this.teamId = teamId;
    this.assignee = assignee;
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

  defineAggregationKey(key: string | number, resourceMap: { [x: string]: any; }) {
    return this.teamId ? key : resourceMap[key];
  }

  incrementDatasetElement(key: string) {
    this.data[key] += 1;
  }

  inserElementToDataset(key: string | number | symbol) {
    Object.defineProperty(this.data, key, {
      value: 1,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  sumIssues(issues: string | any[], resourceMap: any) {
    for (let i = 0; i < issues.length; i += 1) {
      const key = this.defineAggregationKey(
        issues[i].fields.assignee.key,
        resourceMap,
      );

      if (key) {
        if (Object.prototype.hasOwnProperty.call(this.data, key)) {
          this.incrementDatasetElement(key);
        } else {
          this.inserElementToDataset(key);
        }
      }
    }
  }

  getDataset({ issues, total }: any, resourceMap: any) {
    this.sumIssues(issues, resourceMap);
    return {
      labels: Object.keys(this.data),
      values: Object.values(this.data),
      maxResults: this.maxResults,
      total,
    };
  }
};

export default Dashboard;
