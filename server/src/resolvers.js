module.exports = {
  Query: {
    issues: async (_, { jql, pageSize = 20, after = 0 }, { dataSources }) =>
      dataSources.issueAPI.getAllIssues(jql, pageSize, after),
    issue: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getIssueById({ issueId: id }),
    versions: async (_, { id, pageSize = 4, after = 4 }, { dataSources }) =>
      dataSources.issueAPI.getAllVersions(id, pageSize, after),
    absences: (_, { id }, { dataSources }) =>
      dataSources.absenceAPI.getAbsencesById({ userId: id }),
    teams: async (_, __, { dataSources }) => dataSources.resourceAPI.getTeams(),
    resources: (_, __, { dataSources }) =>
      dataSources.resourceAPI.getResources(),
  },
  Mutation: {
    editIssue: async (_, { issueId, summary }, { dataSources }) =>
      dataSources.issueAPI.editIssue({ issueId, summary }),
  },
};
