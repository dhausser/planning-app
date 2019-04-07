module.exports = {
  Query: {
    issues: async (_, __, { dataSources }) =>
      dataSources.issueAPI.getAllIssues(),
    issue: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getIssueById({ issueId: id }),
    absences: async (_, __, { dataSources }) =>
      dataSources.absenceAPI.getAllAbsences(),
    absence: (_, { id }, { dataSources }) =>
      dataSources.absenceAPI.getAbsenceById({ absenceId: id }),
    teams: async (_, __, { dataSources }) => dataSources.resourceAPI.getTeams(),
    resources: (_, __, { dataSources }) =>
      dataSources.resourceAPI.getResources(),
  },
};
