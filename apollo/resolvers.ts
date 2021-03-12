import mockData from "./data.json";

export const resolvers = {
  Query: {
    issues: () => mockData.issues,
    dashboardIssues: () => mockData.issues.issues,
    roadmapIssues: () => mockData.issues.issues,
    epics: () => mockData.issues,
    issue: () => mockData.issues.issues[0],
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
