import ResourceAPI from './datasources/resources'
import IssueAPI from './datasources/issues'
import AbsenceAPI from './datasources/absences'

const issueAPI = new IssueAPI()
const absenceAPI = new AbsenceAPI()
const resourceAPI = new ResourceAPI()

export default {
  teams: () => resourceAPI.getTeams(),

  resources: () => resourceAPI.getResources(),

  absences: async id => absenceAPI.getAbsencesById({ userId: id }),

  issues: ({ jql, pageSize, after }) =>
    issueAPI.getAllIssues(jql, pageSize, after),

  issue: async id => issueAPI.getIssueById({ issueId: id }),

  versions: ({ id, pageSize, after }) =>
    issueAPI.getAllVersions(id, pageSize, after),

  editIssue: async ({ issueId, summary }) =>
    issueAPI.editIssue(issueId, summary),
}
