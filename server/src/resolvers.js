const resolvers = {
  Query: {
    /**
     * Jira REST API
     */
    issues: (_, {
      projectId, statusId, versionId, teamId, resourceId, startAt, maxResults,
    }, { dataSources }) => (
      dataSources.issueAPI.getIssues({
        projectId, statusId, versionId, teamId, resourceId, startAt, maxResults,
      })
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
    absences: (_, { id }, { dataSources }) => (
      dataSources.absenceAPI.getAbsencesById({ userId: id })
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
    login: (_, __, { user }) => {
      if (user.token) {
        console.log(`Loging in with token ${user.token}`);
        return user.token;
      }
      console.log('Cannot find login token');
      return 0;
    },
    editIssue: (_, { id, value, type }, { dataSources }) => (
      dataSources.issueAPI.editIssue({ id, value, type })
    ),
    assignIssue: (_, { id, key }, { dataSources }) => (
      dataSources.issueAPI.assignIssue({ id, key })
    ),
    /**
     * Mongo DB
     */
    createResource: (_, {
      id, firstname, lastname, email, team,
    }, { dataSources }) => (
      dataSources.resourceAPI.createResource({
        id, firstname, lastname, email, team,
      })
    ),
    updateResource: (_, {
      id, firstname, lastname, email, team,
    }, { dataSources }) => (
      dataSources.resourceAPI.updateResource({
        id, firstname, lastname, email, team,
      })
    ),
    deleteResource: (_, { id }, { dataSources }) => (
      dataSources.resourceAPI.deleteResource({ id })
    ),
  },
};

export default resolvers;
