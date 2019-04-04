import React from 'react';
// import { fetchIssues } from '../pages/Issues';

export default React.createContext({
  fixVersion: { id: '15900', name: '2.1' },
  team: '',
});

export const GlobalContext = React.createContext({
  issues: [],
  teams: [],
  resources: [],
  isLoading: true,
  toggleFilter: () => {},
});

/**
 * TODO: Lift app filter state to filter context
 */
// async function getInitialData() {
//   // Initial Jira data request
//   const [
//     teamsPromise,
//     resourcesPromise,
//     fixVersionsPromise,
//   ] = await Promise.all([
//     fetch('/api/teams'),
//     fetch('/api/resources'),
//     fetch('/api/fixVersions'),
//   ]);
//   const [teams, resources, fixVersions] = await Promise.all([
//     teamsPromise.json(),
//     resourcesPromise.json(),
//     fixVersionsPromise.json(),
//   ]);

//   // Reinstate localstorage
//   const team = localStorage.getItem('team')
//     ? JSON.parse(localStorage.getItem('team'))
//     : null;
//   const fixVersion = localStorage.getItem('fixVersion')
//     ? JSON.parse(localStorage.getItem('fixVersion'))
//     : fixVersions.values[0];

//   // Fetch Jira issues
//   const { issues, maxResults, total } = await fetchIssues('');

//   // Update State
// }

// async function updateFilter({ team, fixVersion }) {
//   // Handle fixVersion udpate
//   if (fixVersion != null) {
//     this.setState({ isLoading: true });
//     localStorage.setItem('fixVersion', JSON.stringify(fixVersion));

//     const { issues, maxResults, total } = await fetchIssues(
//       `filter=22119 AND fixVersion=${fixVersion.id} ORDER BY priority DESC`
//     );
//   }

//   Handle team update
//   if (team != null) {
//     if (team === state.team) {
//       localStorage.removeItem('team');
//       setState({ team: null });
//     } else {
//       localStorage.setItem('team', JSON.stringify(team));
//       setState({ team });
//     }
//   }
// }
