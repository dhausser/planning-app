import { IResolvers } from 'apollo-server-express';
import { Args, Context, UserInput, Pagination } from './types';

const resolvers: IResolvers = {
  Query: {
    issues: (
      _: void,
      {
        projectId,
        issuetypeId,
        statusId,
        versionId,
        teamId,
        resourceId,
        startAt,
        maxResults,
      }: Args,
      { dataSources }: Context
    ): any =>
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
    dashboardIssues: (
      _: void,
      { projectId, versionId, teamId }: Args,
      { dataSources }: Context
    ) =>
      dataSources.issueAPI.getDashboardIssues({ projectId, versionId, teamId }),
    roadmapIssues: (
      _: void,
      { projectId, versionId }: Args,
      { dataSources }: Context
    ) => dataSources.issueAPI.getRoadmapIssues(projectId, versionId),
    epics: (
      _: void,
      { projectId, versionId }: Args,
      { dataSources }: Context
    ) => dataSources.issueAPI.getEpics(projectId, versionId),
    issue: (_: void, { id }: Args, { dataSources }: Context) =>
      dataSources.issueAPI.getIssueById(id),
    projects: (_: void, __: void, { dataSources }: Context) =>
      dataSources.issueAPI.getProjects(),
    versions: (_: void, { id }: Args, { dataSources }: Context) =>
      dataSources.issueAPI.getVersions(id),
    statuses: (_: void, { id }: Args, { dataSources }: Context) =>
      dataSources.issueAPI.getStatuses(id),
    myself: (_: void, __: void, { dataSources }: Context) =>
      dataSources.issueAPI.getCurrentUser(),
    user: (_: void, { id }: Args, { dataSources }: Context) =>
      dataSources.issueAPI.getUser(id),
    assignableUsers: (
      _: void,
      {
        username,
        project,
        issueKey,
        startAt,
        maxResults,
        actionDescriptorId,
      }: any,
      { dataSources }: Context
    ) =>
      dataSources.issueAPI.getAssignableUsers({
        username,
        project,
        issueKey,
        startAt,
        maxResults,
        actionDescriptorId,
      }),
    loginToken: (_: void, __: void, { user }: { user: { token: string } }) =>
      user.token,
    absences: (_: void, { id }: Args, { dataSources }: Context) =>
      dataSources.absenceAPI.getAbsencesById({ userId: id }),
    resources: (_: void, { offset, limit, teamId }: Pagination, { dataSources }: Context) =>
      dataSources.userAPI.findUsers({ offset, limit, teamId }),
    resource: (_: void, { id }: Args, { dataSources }: Context) =>
      dataSources.userAPI.findUser({ id }),
    teams: (_: void, __: void, { dataSources }: Context) =>
      dataSources.userAPI.findTeams(),
    currentUser: async (_: void, __: void, { dataSources, token }: Context) => dataSources.issueAPI.getUserLogin(),
  },
  Mutation: {
    login: (_: void, __: void, { user }: { user: { token: string } }) =>
      user.token,
    signin: async (_: void, __: void, { dataSources, user, token, res }: Context) => {  
      // 1. If a cookie is present on the request, test whether it is still valid and return the authenticated user    
      if (token) {
        try {
          // If the token is still valid return it
          const currentUser = await dataSources.issueAPI.getUserLogin();
          return currentUser ? { token } : null;
        } catch (error) {
          // If the authenticated failed, clear the cookie
          console.error(error);
          res.clearCookie('token');
          return null;
        }
      }

      // 2. If the user object is present on the session, test whether it is still valid and return the authenticated user  
      if (user) {
        const { token } = user;
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        return user;
      }
      return null;
    },
    signout: (_: void, __: void, { res }: { res: any }) => {
      res.clearCookie('token');
      return null;
    },
    editIssue: (_: void, { id, value, type }: any, { dataSources }: Context) =>
      dataSources.issueAPI.editIssue({ id, value, type }),
    assignIssue: (_: void, { id, key }: any, { dataSources }: Context) =>
      dataSources.issueAPI.assignIssue({ id, key }),
    createResource: (_: void, args: UserInput, { dataSources }: Context) =>
      dataSources.userAPI.createUser(args),
    updateResource: (_: void, args: UserInput, { dataSources }: Context) =>
      dataSources.userAPI.updateUser(args),
    deleteResource: (_: void, args: UserInput, { dataSources }: Context) =>
      dataSources.userAPI.deleteUser(args),
    createAllResources: (_: void, args: void, { dataSources }: Context) =>
      dataSources.userAPI.createAllUsers(),
    deleteAllResources: (_: void, args: void, { dataSources }: Context) =>
      dataSources.userAPI.deleteAllUsers(),
  },
};

export default resolvers;
