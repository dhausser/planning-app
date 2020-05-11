import { IResolvers } from 'apollo-server-express';
import { Args, Context, UserInput, Pagination } from './types';

const resolvers: IResolvers = {
  Query: {
    issues: (_: void, args: Args, { dataSources }: Context) =>
      dataSources.issueAPI.getIssues(args),
    dashboardIssues: (_: void, args: Args, { dataSources }: Context) =>
      dataSources.issueAPI.getDashboardIssues(args),
    roadmapIssues: (_: void, args: Args, { dataSources }: Context) =>
      dataSources.issueAPI.getRoadmapIssues(args),
    epics: (_: void, args: Args, { dataSources }: Context) =>
      dataSources.issueAPI.getEpics(args),
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
    assignableUsers: (_: void, args: Args, { dataSources }: Context) =>
      dataSources.issueAPI.getAssignableUsers(args),
    absences: (_: void, { id }: Args, { dataSources }: Context) =>
      dataSources.absenceAPI.getAbsencesById({ userId: id }),
    resources: (_: void, args: Pagination, { dataSources }: Context) =>
      dataSources.userAPI.findUsers(args),
    resource: (_: void, { id }: Args, { dataSources }: Context) =>
      dataSources.userAPI.findUser({ id }),
    teams: (_: void, __: void, { dataSources }: Context) =>
      dataSources.userAPI.findTeams(),
    currentUser: async (_: void, __: void, { dataSources }: Context) =>
      dataSources.issueAPI.getUserLogin(),
    // loginToken: (_: void, __: void, { user }: { user: { token: string } }) =>
    //   user.token,
  },
  Mutation: {
    // login: (_: void, __: void, { user }: { user: { token: string } }) =>
    //   user.token,
    signin: async (_: void, __: void, context: Context) =>
      context.dataSources.issueAPI.signin(context),
    signout: (_: void, __: void, { dataSources, res }: Context) =>
      dataSources.issueAPI.signout({ res }),
    editIssue: (_: void, { id, value, type }: Args, { dataSources }: Context) =>
      dataSources.issueAPI.editIssue({ id, value, type }),
    assignIssue: (_: void, { id, key }: Args, { dataSources }: Context) =>
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
