module.exports = {
  Query: {
    /**
     * Jira REST API
     */
    issues: (
      _,
      {
        projectId,
        issuetypeId,
        statusId,
        versionId,
        teamId,
        resourceId,
        startAt,
        maxResults,
      },
      { dataSources },
    ) =>
      dataSources.issueAPI.getIssues({
        projectId,
        issuetypeId,
        statusId,
        versionId,
        teamId,
        resourceId,
        startAt,
        maxResults,
      }),
    dashboardIssues: (_, { projectId, versionId, teamId }, { dataSources }) =>
      dataSources.issueAPI.getDashboardIssues({ projectId, versionId, teamId }),
    roadmapIssues: (_, { projectId, versionId }, { dataSources }) =>
      dataSources.issueAPI.getRoadmapIssues(projectId, versionId),
    epics: (_, { projectId, versionId }, { dataSources }) =>
      dataSources.issueAPI.getEpics(projectId, versionId),
    issue: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getIssueById(id),
    projects: (_, __, { dataSources }) => dataSources.issueAPI.getProjects(),
    versions: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getVersions(id),
    statuses: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getStatuses(id),
    myself: (_, __, { dataSources }) => dataSources.issueAPI.getCurrentUser(),
    user: (_, { id }, { dataSources }) => dataSources.issueAPI.getUser(id),
    assignableUsers: (
      _,
      { username, project, issueKey, startAt, maxResults, actionDescriptorId },
      { dataSources },
    ) =>
      dataSources.issueAPI.getAssignableUsers({
        username,
        project,
        issueKey,
        startAt,
        maxResults,
        actionDescriptorId,
      }),
    loginToken: (_, __, { user }) => user.token,

    /**
     * CDPR Portal REST API
     */
    absences: (_, { id }, { dataSources }) =>
      // dataSources.absenceAPI.getAllAbsences({ userId: id }),
      dataSources.absenceAPI.getAbsencesById({ userId: id }),

    /**
     * MongoDB
     */
    resources: async (_, { teamId }, { dataSources }) => {
      const { resourcesList } = await dataSources.resourceAPI.getResources({
        teamId,
      });
      return resourcesList;
    },
    resource: (_, { id }, { dataSources }) =>
      dataSources.resourceAPI.getResourceById({ resourceId: id }),
    teams: (_, __, { dataSources }) => dataSources.resourceAPI.getTeams(),
    team: (_, { id }, { dataSources }) =>
      dataSources.resourceAPI.getResources({ teamId: id }),
  },

  Mutation: {
    /**
     * Jira REST API
     */
    login: (_, __, { user }) => user.token,
    editIssue: (_, { id, value, type }, { dataSources }) =>
      dataSources.issueAPI.editIssue({ id, value, type }),
    assignIssue: (_, { id, key }, { dataSources }) =>
      dataSources.issueAPI.assignIssue({ id, key }),
    /**
     * Mongo DB
     */
    insertResource: (_, context, { dataSources }) =>
      dataSources.resourceAPI.insertResource(context),
    updateResource: (_, context, { dataSources }) =>
      dataSources.resourceAPI.updateResource(context),
    deleteResource: (_, context, { dataSources }) =>
      dataSources.resourceAPI.deleteResource(context),
  },
};
