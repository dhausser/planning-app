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
    
    // team: (_: void, { id }: Args, { dataSources }: Context) =>
    //   dataSources.userAPI.getResources({ id }),
    /**
     * Temporary disable og MongoDB remote database for local testing with Prisma and Sqlite
     */
    // resources: async (_, { teamId }, { dataSources }) => {
    //   const { resourcesList } = await dataSources.resourceAPI.getResources({
    //     teamId,
    //   });
    //   return resourcesList;
    // },
    // resource: (_, { id }, { dataSources }) => (
    //   dataSources.resourceAPI.getResourceById({ resourceId: id })
    // ),
    // teams: (_: void, __: void, { dataSources }: Context) =>
    //   dataSources.resourceAPI.getTeams(),
    // team: (_: void, { id }: Args, { dataSources }: Context) =>
    //   dataSources.resourceAPI.getResources({ teamId: id }),
  },

  Mutation: {
    login: (_: void, __: void, { user }: { user: { token: string } }) =>
      user.token,
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

    // createResource: (_: void, args: UserInput, { dataSources }: Context) =>
    //   dataSources.resourceAPI.insertResource(args),
    // updateResource: (_: void, args: UserInput, { dataSources }: Context) =>
    //   dataSources.resourceAPI.updateResource(args),
    // deleteResource: (_: void, args: UserInput, { dataSources }: Context) =>
    //   dataSources.resourceAPI.deleteResource(args),

  },
};

export default resolvers;
