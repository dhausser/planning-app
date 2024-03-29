import { RESTDataSource } from "apollo-datasource-rest";
import { PrismaClient } from "@prisma/client";
import Issues from "../models/Issues";
import Dashboard from "../models/Dashboard";
import Roadmap from "../models/Roadmap";
// import Oauth from '../models/Auth';
import {
  Context,
  Project,
  Filter,
  AvatarUrls,
  IssueConnection,
  AssignableUsers,
  ApolloContext,
} from "../types";

import mockData from "../mocks/data.json";

const USE_MOCK_DATA = true;

function parseAvatarUrls(avatarUrls: AvatarUrls) {
  return {
    large: avatarUrls["48x48"] as string,
    small: avatarUrls["24x24"] as string,
    xsmall: avatarUrls["16x16"] as string,
    medium: avatarUrls["32x32"] as string,
  };
}

class IssueAPI extends RESTDataSource {
  prisma: PrismaClient;

  // oauth: Oauth;

  constructor({ prisma }: ApolloContext) {
    super();
    this.prisma = prisma;
    this.baseURL = process.env.HOST;
    // this.oauth = new Oauth(this.baseURL);
  }

  /**
   * Sign request before sending
   * @param {object} req - request object
   */
  // willSendRequest(req: {
  //   headers: { set: (arg0: string, arg1: string) => void };
  // }) {
  //   req.headers.set('Authorization', this.oauth.sign(req, this.context.token));
  // }

  /**
   * Get projects
   */
  async getProjects() {
    if (USE_MOCK_DATA) return mockData.projects;

    const response = await this.get("project/search");
    // const projects = response.map((project: Project) => ({
    //   ...project,
    //   projectTypeKey: `${project.projectTypeKey
    //     .charAt(0)
    //     .toUpperCase()}${project.projectTypeKey.slice(1)}`,
    //   avatarUrls: parseAvatarUrls(project.avatarUrls),
    // }));
    return response ? response.values : [];
  }

  /**
   * Get versions
   * @param {string} projectIdOrKey - project ID or key
   */
  async getVersions(projectIdOrKey: string) {
    if (USE_MOCK_DATA) return mockData.versions;

    const response = await this.get(
      `project/${projectIdOrKey || 10000}/versions`
    );
    const unreleased = response.filter(
      (value: { released: boolean }) => value.released === false
    );

    return Array.isArray(response) ? unreleased : [];
  }

  /**
   * Get statuses
   * @param {string} projectIdOrKey - project ID or key
   */
  async getStatuses(projectIdOrKey: string) {
    if (USE_MOCK_DATA) return mockData.status;

    const response = await this.get(`project/${projectIdOrKey}/statuses`);
    const { statuses } = response[0];
    return Array.isArray(statuses) ? statuses : [];
  }

  /**
   * Get issues
   * @param {string} projectId - project ID
   * @param {string} versionId - version ID
   * @param {string} statusId - status ID
   * @param {string} issuetypeId - issuetype ID
   * @param {string} teamId - team ID
   * @param {string} resourceId - resource ID
   * @param {int} startAt - start value
   * @param {int} maxResults - max results returned
   */
  async getIssues({
    projectId,
    issuetypeId,
    versionId,
    statusId,
    teamId,
    resourceId,
    startAt,
    maxResults,
  }: IssueConnection) {
    if (USE_MOCK_DATA) return mockData.issues;

    // let assignee = null;
    // if (resourceId) {
    //   assignee = resourceId;
    // } else if (teamId) {
    //   assignee = await this.context.dataSources.userAPI.getAssignee({ teamId });
    // }
    // const resourceMap = await this.context.dataSources.userAPI.getResourceMap();
    // const issues = new Issues({
    //   projectId,
    //   issuetypeId,
    //   statusId,
    //   versionId,
    //   assignee,
    //   resourceMap,
    //   startAt,
    //   maxResults,
    // });
    // const params = issues.getParams();
    const response = await this.get("search");

    return response ? response.values : [];
  }

  /**
   * Get dashboard issues
   * @param {string} projectId - project ID
   * @param {string} versionId - version ID
   * @param {string} teamId - team ID
   */
  async getDashboardIssues({ projectId, versionId, teamId }: Filter) {
    const assignee = await this.context.dataSources.userAPI.getAssignee({
      teamId,
    });

    const dashboard = new Dashboard({
      projectId,
      versionId,
      teamId,
      assignee,
    });

    const response = await this.post("search", dashboard.getParams());
    const resourceMap = await this.context.dataSources.userAPI.getResourceMap();

    return dashboard.getDataset(response, resourceMap);
  }

  async getRoadmapIssues({
    projectId,
    versionId,
  }: {
    projectId: string;
    versionId: string;
  }) {
    if (USE_MOCK_DATA) return mockData.issues.issues;

    const roadmap = new Roadmap({ projectId, versionId });
    const response = await this.post("search", roadmap.getParams());
    return roadmap.getDataset(response.issues);
  }

  /**
   * Get epics
   * @param {string} projectId - project ID
   * @param {string} versionId - version ID
   */
  async getEpics({
    projectId,
    versionId,
  }: {
    projectId: string;
    versionId: string;
  }) {
    if (USE_MOCK_DATA) return mockData.issues;

    const jql = `issuetype = epic${
      projectId ? ` and project = ${projectId}` : ""
    } ${versionId ? ` and fixversion = ${versionId}` : ""}`;
    const response = await this.post("search", {
      jql,
      fields: ["summary"],
    });
    return Array.isArray(response.issues) ? response.issues : [];
  }

  /**
   * Get issue
   * Returns a full representation of the issue for the given issue key.
   * @param {string} issueId - issue ID or key
   * @param {string} fields - the list of fields to return for the issue.
   * By default, all fields are returned.
   * @param {string} expand - the list of fields to return for the issue.
   * @param {string} properties - the list of properties to return for the issue.
   * By default no properties are returned.
   * @param {boolean} updateHistory - the list of fields to return for the issue.
   */
  async getIssueById(issueId: string) {
    const fields = [
      "summary",
      "description",
      "status",
      "assignee",
      "reporter",
      "issuetype",
      "priority",
      "fixVersions",
      "comment",
    ];
    const issue = await this.get(`issue/${issueId}`, { fields });
    const { assignee, reporter } = issue.fields;
    if (assignee) {
      assignee.avatarUrls = parseAvatarUrls(assignee.avatarUrls);
    }
    if (reporter) {
      reporter.avatarUrls = parseAvatarUrls(reporter.avatarUrls);
    }
    return issue;
  }

  /**
   * Get user
   * Returns currently logged user. This resource cannot be accessed anonymously.
   */
  async getCurrentUser() {
    if (USE_MOCK_DATA) return mockData.resources[0];

    const user = await this.get("myself");
    return {
      ...user,
      avatarUrls: parseAvatarUrls(user.avatarUrls),
    };
  }

  /**
   * Get user
   * Returns a user. This resource cannot be accessed anonymously.
   * @param {string} username - the username
   * @param {string} key - user key
   */
  async getUser(key: string) {
    if (USE_MOCK_DATA) return mockData.resources[0];

    const user = await this.get("user", { key });
    return {
      ...user,
      avatarUrls: parseAvatarUrls(user.avatarUrls),
    };
  }

  /**
   * Get current logged user
   */
  async getUserLogin() {
    const { token, res } = this.context;

    // If a token is present in cookie check if it is still valid otherwise invalidate it
    if (token) {
      try {
        const user = await this.get("/rest/auth/1/session");
        return user.name;
      } catch (error) {
        console.error(error);
        res.clearCookie("token");
        return null;
      }
    }

    return "FAKE_USER_TOKEN";
  }

  /**
   * Signin
   */
  async signin() {
    const { user, res } = this.context;

    // If the user object is present on the session, test whether it is still valid and return the authenticated user
    if (user) {
      res.cookie("token", user.token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
      });
      return user;
    }
    return null;

    // // 1. If a cookie is present on the request, test whether it is still valid and return the authenticated user
    // if (token) {
    //   try {
    //     // If the token is still valid return it
    //     const currentUser = await this.getUserLogin();
    //     return currentUser ? { token } : null;
    //   } catch (error) {
    //     // If the authenticated failed, clear the cookie
    //     console.error(error);
    //     res.clearCookie('token');
    //     return null;
    //   }
    // }
  }

  /**
   * Signout
   */
  // eslint-disable-next-line class-methods-use-this
  async signout({ res }: Context) {
    res.clearCookie("token");
    return null;
  }

  /**
   * Find assignable users
   * Returns a list of users that match the search string.
   * This resource cannot be accessed anonymously.
   * Please note that this resource should be called with an issue key when
   * a list of assignable users is retrieved for editing.
   * For create only a project key should be supplied.
   * The list of assignable users may be incorrect if it's called with the project key for editing.
   * @param {string} username - the username
   * @param {string} project - the key of the project we are finding assignable users for
   * @param {string} issueKey - the issue key for the issue being edited we need to
   * find assignable users for.
   * @param {int} [startAt] - the index of the first user to return (0-based)
   * @param {int} [maxResults] - the maximum number of users to return (defaults to 50).
   * The maximum allowed value is 1000.
   * If you specify a value that is higher than this number, your search results will be truncated.
   * @param {int} [actionDescriptorId]
   */
  async getAssignableUsers({ project }: AssignableUsers) {
    const response = await this.get("rest/api/2/user/assignable/search", {
      project,
    });
    return Array.isArray(response.users) || [];
  }

  /* Mutations */
  /**
   * Edit issue
   * Edits an issue from a JSON representation.
   * @param {string} issueIdOrKey - issue ID or key
   * @param {string} value - value to be updated
   * @param {string} type - name of field to update
   */
  async editIssue({
    id,
    value,
    type,
  }: {
    id: string;
    value: string;
    type: string;
  }) {
    return this.put(`issue/${id}`, { fields: { [type]: value } });
  }

  /**
   * Assign
   * Assigns an issue to a user.
   * @param {string} param0 - issue ID or key
   * @param {key} param0 - user key
   */
  async assignIssue({ id, key }: { id: string; key: string }) {
    return this.put(`issue/${id}/assignee`, { name: key });
  }

  async getAuthToken() {
    const authorizationUrl = process.env.AUTHORIZATION_URL;
    return this.get(authorizationUrl);
  }
}

export default IssueAPI;
