import { IResolvers } from "apollo-server-express";

export const resolvers: IResolvers = {
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

// import { Args, Context, UserInput, Pagination } from './types';

// const resolvers: IResolvers = {
//   Query: {
//     issues: (_, args: Args, { dataSources }: Context) =>
//       dataSources.issueAPI.getIssues(args),
//     dashboardIssues: (_, args: Args, { dataSources }: Context) =>
//       dataSources.issueAPI.getDashboardIssues(args),
//     roadmapIssues: (_, args: Args, { dataSources }: Context) =>
//       dataSources.issueAPI.getRoadmapIssues(args),
//     epics: (_, args: Args, { dataSources }: Context) =>
//       dataSources.issueAPI.getEpics(args),
//     issue: (_, { id }: Args, { dataSources }: Context) =>
//       dataSources.issueAPI.getIssueById(id),
//     projects: (_, __, { dataSources }: Context) =>
//       dataSources.issueAPI.getProjects(),
//     versions: (_, { id }: Args, { dataSources }: Context) =>
//       dataSources.issueAPI.getVersions(id),
//     statuses: (_, { id }: Args, { dataSources }: Context) =>
//       dataSources.issueAPI.getStatuses(id),
//     myself: (_, __, { dataSources }: Context) =>
//       dataSources.issueAPI.getCurrentUser(),
//     user: (_, { id }: Args, { dataSources }: Context) =>
//       dataSources.issueAPI.getUser(id),
//     assignableUsers: (_, args: Args, { dataSources }: Context) =>
//       dataSources.issueAPI.getAssignableUsers(args),
//     absences: (_, { id }: Args, { dataSources }: Context) =>
//       dataSources.absenceAPI.getAbsencesById({ userId: id }),
//     resources: (_, args: Pagination, { dataSources }: Context) =>
//       dataSources.userAPI.findUsers(args),
//     resource: (_, { id }: Args, { dataSources }: Context) =>
//       dataSources.userAPI.findUser({ id }),
//     teams: (_, __, { dataSources }: Context) =>
//       dataSources.userAPI.findTeams(),
//     currentUser: async (_, __, { dataSources }: Context) =>
//       dataSources.issueAPI.getUserLogin(),
//   },
//   Mutation: {
//     signin: async (_, __, context: Context) =>
//       context.dataSources.issueAPI.signin(context),
//     signout: (_, __, { dataSources, res }: Context) =>
//       dataSources.issueAPI.signout({ res }),
//     editIssue: (_, { id, value, type }: Args, { dataSources }: Context) =>
//       dataSources.issueAPI.editIssue({ id, value, type }),
//     assignIssue: (_, { id, key }: Args, { dataSources }: Context) =>
//       dataSources.issueAPI.assignIssue({ id, key }),
//     createResource: (_, args: UserInput, { dataSources }: Context) =>
//       dataSources.userAPI.createUser(args),
//     updateResource: (_, args: UserInput, { dataSources }: Context) =>
//       dataSources.userAPI.updateUser(args),
//     deleteResource: (_, args: UserInput, { dataSources }: Context) =>
//       dataSources.userAPI.deleteUser(args),
//     createAllResources: (_, __, { dataSources }: Context) =>
//       dataSources.userAPI.createAllUsers(),
//     deleteAllResources: (_, __, { dataSources }: Context) =>
//       dataSources.userAPI.deleteAllUsers(),
//   },
// };
