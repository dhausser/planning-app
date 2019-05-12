const resolvers = {
  Query: {
    /**
     * Jira REST API
     */
    issues: (_, { jql, pageSize = 20, after = 0 }, { dataSources }) =>
      dataSources.issueAPI.getAllIssues(jql, pageSize, after),
    issue: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getIssueById({ issueId: id }),
    versions: (_, { id, pageSize = 4, after = 4 }, { dataSources }) =>
      dataSources.issueAPI.getAllVersions(id, pageSize, after),
    projects: (_, __, { dataSources }) => dataSources.issueAPI.getAllProjects(),

    /**
     * CDPR Portal REST API
     */
    absences: (_, { id }, { dataSources }) =>
      dataSources.absenceAPI.getAbsencesById({ userId: id }),

    /**
     * MongoDB
     */
    resources: (_, __, { dataSources }) =>
      dataSources.resourceAPI.getResources(),
    resource: (_, { id }, { dataSources }) =>
      dataSources.resourceAPI.getResourceById({ resourceId: id }),
    teams: (_, __, { dataSources }) => dataSources.resourceAPI.getTeams(),
    team: (_, { id }, { dataSources }) =>
      dataSources.resourceAPI.getResourcesByTeam({ teamId: id }),
  },
  Mutation: {
    /**
     * Jira REST API
     */
    login: async (_, { username, password }, { dataSources }) =>
      dataSources.issueAPI.loginUser(username, password),
    editIssue: async (_, { issueId, summary }, { dataSources }) =>
      dataSources.issueAPI.editIssue(issueId, summary),
  },
}

export default resolvers
