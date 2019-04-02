import React from 'react';
import Page from '@atlaskit/page';
import StarterNavigation from '../components/StarterNavigation';

export default function App(props) {
  return (
    <Page
      // navigationWidth={navOpenState.width}
      navigation={<StarterNavigation />}
    >
      {props.children}
    </Page>
  );
}

// const [
//   teamsPromise,
//   resourcesPromise,
//   fixVersionsPromise,
// ] = await Promise.all([
//   fetch('/api/teams'),
//   fetch('/api/resources'),
//   fetch('/api/fixVersions'),
// ]);
// const [teams, resources, fixVersions] = await Promise.all([
//   teamsPromise.json(),
//   resourcesPromise.json(),
//   fixVersionsPromise.json(),
// ]);
// const team = localStorage.getItem('team')
//   ? JSON.parse(localStorage.getItem('team'))
//   : null;
// const fixVersion = localStorage.getItem('fixVersion')
//   ? JSON.parse(localStorage.getItem('fixVersion'))
//   : fixVersions.values[0];
// const bodyData = {
//   jql: '',
//   // maxResults: 250,
//   fields: [
//     'summary',
//     'description',
//     'status',
//     'assignee',
//     'creator',
//     'issuetype',
//     'priority',
//     'fixVersions',
//   ],
// };
// const { issues, maxResults, total } = await fetchIssues(bodyData);
// this.setState({ issues, maxResults, total, isLoading: false });
// this.setState({
//   isLoading: false,
//   maxResults,
//   total,
//   fixVersions: fixVersions.values,
//   fixVersion,
//   issues,
//   resources,
//   teams,
//   team,
// });

// updateFilter = async ({ team, fixVersion }) => {
//   if (fixVersion != null) {
//     this.setState({ isLoading: true });
//     localStorage.setItem('fixVersion', JSON.stringify(fixVersion));

//     const bodyData = {
//       jql: `filter=22119 AND fixVersion=${
//         fixVersion.id
//       } ORDER BY priority DESC`,
//       maxResults: 250,
//       fields: [
//         'summary',
//         'description',
//         'status',
//         'assignee',
//         'creator',
//         'issuetype',
//         'priority',
//         'fixVersions',
//       ],
//     };
//     const { issues, maxResults, total } = await fetchIssues(bodyData);

//     this.setState({
//       issues,
//       fixVersion,
//       maxResults,
//       total,
//       isLoading: false,
//     });
//   }

//   if (team != null) {
//     if (team === this.state.team) {
//       localStorage.removeItem('team');
//       this.setState({ team: null });
//     } else {
//       localStorage.setItem('team', JSON.stringify(team));
//       this.setState({ team });
//     }
//   }
// };
