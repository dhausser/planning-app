const resolvers = {
  Query: {
    /**
     * Jira REST API
     */
    // Authentication
    oauthRequest: async (_, __, { dataSources }) =>
      dataSources.authAPI.getRequestToken(),
    oauthAccess: async (_, { oauthVerifier }, { dataSources }) =>
      dataSources.authAPI.getAccessToken(oauthVerifier),
    // Resources
    issues: (_, { jql, startAt = 0, maxResults = 20 }, { dataSources }) =>
      dataSources.issueAPI.getIssues(jql, startAt, maxResults),
    issue: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getIssueById({ issueId: id }),
    versions: (_, { id, startAt = 0, maxResults = 20 }, { dataSources }) =>
      dataSources.issueAPI.getVersions(id, startAt, maxResults),
    projects: (_, __, { dataSources }) => dataSources.issueAPI.getProjects(),

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
    // Authentication
    login: async (
      _,
      { oauthToken, oauthSecret, oauthVerifier },
      { dataSources },
    ) =>
      dataSources.authAPI.getAccessToken(
        oauthToken,
        oauthSecret,
        oauthVerifier,
      ),
    // Resources
    editIssue: async (_, { issueId, summary, assignee }, { dataSources }) =>
      dataSources.issueAPI.editIssue(issueId, summary, assignee),
  },
}

export default resolvers
