export const resolvers = {
  Query: {
    issues: (_, args, { dataSources }) => dataSources.issueAPI.getIssues(args),
    dashboardIssues: (_, args, { dataSources }) =>
      dataSources.issueAPI.getDashboardIssues(args),
    roadmapIssues: (_, args, { dataSources }) =>
      dataSources.issueAPI.getRoadmapIssues(args),
    epics: (_, args, { dataSources }) => dataSources.issueAPI.getEpics(args),
    issue: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getIssueById(id),
    projects: (_, __, { dataSources }) => dataSources.issueAPI.getProjects(),
    versions: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getVersions(id),
    statuses: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getStatuses(id),
    myself: (_, __, { dataSources }) => dataSources.issueAPI.getCurrentUser(),
    user: (_, { id }, { dataSources }) => dataSources.issueAPI.getUser(id),
    assignableUsers: (_, args, { dataSources }) =>
      dataSources.issueAPI.getAssignableUsers(args),
    absences: (_, { id }, { dataSources }) =>
      dataSources.absenceAPI.getAbsencesById({ userId: id }),
    resources: (_, args, { dataSources }) =>
      dataSources.userAPI.findUsers(args),
    resource: (_, { id }, { dataSources }) =>
      dataSources.userAPI.findUser({ id }),
    teams: (_, __, { dataSources }) => dataSources.userAPI.findTeams(),
    currentUser: (_, __, { dataSources }) =>
      dataSources.issueAPI.getUserLogin(),
    authToken: (_, __, { dataSources }) => dataSources.issueAPI.getAuthToken(),
  },
  Mutation: {
    signin: (_, __, { dataSources }) => dataSources.issueAPI.signin(),
    signout: (_, __, { dataSources, res }) =>
      dataSources.issueAPI.signout({ res }),
    editIssue: (_, { id, value, type }, { dataSources }) =>
      dataSources.issueAPI.editIssue({ id, value, type }),
    assignIssue: (_, { id, key }, { dataSources }) =>
      dataSources.issueAPI.assignIssue({ id, key }),
    createResource: (_, args, { dataSources }) =>
      dataSources.userAPI.createUser(args),
    updateResource: (_, args, { dataSources }) =>
      dataSources.userAPI.updateUser(args),
    deleteResource: (_, args, { dataSources }) =>
      dataSources.userAPI.deleteUser(args),
    createAllResources: (_, __, { dataSources }) =>
      dataSources.userAPI.createAllUsers(),
    deleteAllResources: (_, __, { dataSources }) =>
      dataSources.userAPI.deleteAllUsers(),
  },
};
