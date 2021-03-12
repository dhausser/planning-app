import mockData from "./data.json";

export const resolvers = {
  Query: {
    issues: () => mockData.issues,
    dashboardIssues: () => mockData.issues,
    roadmapIssues: () => mockData.issues,
    epics: () => mockData.issues,
    issue: () => mockData.issues[0],
    projects: () => mockData.projects,
    versions: () => mockData.versions,
    statuses: () => mockData.status,
    myself: () => mockData.resources[0],
    user: () => mockData.resources[0],
    assignableUsers: () => mockData.resources,
    absences: () => [],
    resources: () => mockData.resources,
    resource: () => mockData.resources[0],
    teams: () => mockData.teams,
    currentUser: () => "FAKE_USER_TOKEN",
    authToken: () => "FAKE_AUTH_TOKEN",
  },
};
