const resolvers = {
  Query: {
    /**
     * Jira REST API
     */
    issues: (_, { jql, startAt = 0, maxResults = 20 }, { dataSources }) => (
      dataSources.issueAPI.getIssues(jql, startAt, maxResults)
    ),
    dashboardIssues: (_, { jql, startAt = 0, maxResults = 20 }, { dataSources }) => (
      dataSources.issueAPI.getDashboardIssues(jql, startAt, maxResults)
    ),
    roadmapIssues: (_, { jql }, { dataSources }) => (
      dataSources.issueAPI.getRoadmapIssues(jql)
    ),
    issue: (_, { id }, { dataSources }) => (
      dataSources.issueAPI.getIssueById({ issueId: id })
    ),
    versions: (_, { id, startAt = 0, maxResults = 20 }, { dataSources }) => (
      dataSources.issueAPI.getVersions(id, startAt, maxResults)
    ),
    projects: (_, __, { dataSources }) => (
      dataSources.issueAPI.getProjects()
    ),

    /**
     * CDPR Portal REST API
     */
    absences: (_, { id, secret, versionId }, { dataSources }) => (
      dataSources.absenceAPI.getAbsencesById({ userId: id, secret, versionId })
    ),

    /**
     * MongoDB
     */
    resources: (_, __, { dataSources }) => (
      dataSources.resourceAPI.getResources()
    ),
    resource: (_, { id }, { dataSources }) => (
      dataSources.resourceAPI.getResourceById({ resourceId: id })
    ),
    teams: (_, __, { dataSources }) => (
      dataSources.resourceAPI.getTeams()
    ),
    team: (_, { id }, { dataSources }) => (
      dataSources.resourceAPI.getResourcesByTeam({ teamId: id })
    ),
  },

  Mutation: {
    /**
     * Jira REST API
     */
    loginUser: (_, __, { user }) => user.token,
    // Resources
    editIssue: (_, { issueId, summary, assignee }, { dataSources }) => (
      dataSources.issueAPI.editIssue(issueId, summary, assignee)
    ),
  },
};

export default resolvers;
