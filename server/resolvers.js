const resolvers = {
  Query: {
    issues: async (_, { jql, pageSize = 20, after = 0 }, { dataSources }) =>
      dataSources.issueAPI.getAllIssues(jql, pageSize, after),
    issue: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getIssueById({ issueId: id }),
    versions: async (_, { id, pageSize = 4, after = 4 }, { dataSources }) =>
      dataSources.issueAPI.getAllVersions(id, pageSize, after),
    resources: (_, __, { dataSources }) =>
      dataSources.resourceAPI.getResources(),
    resource: (_, { id }, { dataSources }) =>
      dataSources.resourceAPI.getResourceById({ resourceId: id }),
    teams: async (_, __, { dataSources }) => dataSources.resourceAPI.getTeams(),
    team: async (_, { id }, { dataSources }) =>
      dataSources.resourceAPI.getResourcesByTeam({ teamId: id }),
    absences: (_, { id }, { dataSources }) =>
      dataSources.absenceAPI.getAbsencesById({ userId: id }),
    projects: async (_, __, { dataSources }) =>
      dataSources.issueAPI.getAllProjects(),
  },
  Mutation: {
    editIssue: async (_, { issueId, summary }, { dataSources }) =>
      dataSources.issueAPI.editIssue(issueId, summary),
    login: async (_, { username, password }, { dataSources }) =>
      dataSources.issueAPI.loginUser(username, password),
  },
}

export default resolvers
