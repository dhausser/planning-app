const resolvers = {
  Query: {
    /**
     * Jira REST API
     */
    issues: (_, {
      projectId, versionId, teamId, resourceId, startAt, maxResults,
    }, { dataSources }) => (
      dataSources.issueAPI.getIssues(
        projectId, versionId, teamId, resourceId, startAt, maxResults,
      )
    ),
    dashboardIssues: (_, { projectId, versionId, teamId }, { dataSources }) => (
      dataSources.issueAPI.getDashboardIssues({ projectId, versionId, teamId })
    ),
    roadmapIssues: (_, { projectId, versionId }, { dataSources }) => (
      dataSources.issueAPI.getRoadmapIssues(projectId, versionId)
    ),
    epics: (_, { projectId, versionId }, { dataSources }) => (
      dataSources.issueAPI.getEpics(projectId, versionId)
    ),
    issue: (_, { id }, { dataSources }) => (
      dataSources.issueAPI.getIssueById(id)
    ),
    versions: (_, { id, startAt, maxResults }, { dataSources }) => (
      dataSources.issueAPI.getVersions(id, startAt, maxResults)
    ),
    projects: (_, __, { dataSources }) => (
      dataSources.issueAPI.getProjects()
    ),
    myself: (_, __, { dataSources }) => (
      dataSources.issueAPI.getCurrentUser()
    ),
    user: (_, { id }, { dataSources }) => (
      dataSources.issueAPI.getUser(id)
    ),
    assignableUsers: (_, { id }, { dataSources }) => (
      dataSources.issueAPI.getAssignableUsers({ issueKey: id })
    ),

    /**
     * CDPR Portal REST API
     */
    absences: (_, { id, versionId }, { dataSources }) => (
      dataSources.absenceAPI.getAbsencesById({ userId: id, versionId })
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
    editIssue: (_, { id, value, type }, { dataSources }) => (
      dataSources.issueAPI.editIssue({ id, value, type })
    ),
    assignIssue: (_, { id, key }, { dataSources }) => (
      dataSources.issueAPI.assignIssue({ id, key })
    ),
  },
};

export default resolvers;
