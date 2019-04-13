import React, { useContext } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import EmptyState from '@atlaskit/empty-state';
import Spinner from '@atlaskit/spinner';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import IssueList from '../components/IssueList';
import { FilterContext } from '../context/FilterContext';
import Filters from '../components/Filters';
import { projectId } from '../credentials';

const GET_ISSUES = gql`
  query issueList($jql: String, $pageSize: Int!) {
    issues(jql: $jql, pageSize: $pageSize) {
      startAt
      maxResults
      total
      issues {
        id
        key
        summary
        type
        priority
        status {
          name
          category
        }
        fixVersions {
          id
          name
        }
        assignee {
          id
          name
        }
        reporter {
          id
          name
        }
      }
    }
  }
`;

export default function Issues(props) {
  const { fixVersion } = useContext(FilterContext);
  return (
    <ContentWrapper>
      <PageTitle>Issues</PageTitle>
      <Filters />
      <Query
        query={GET_ISSUES}
        variables={{
          jql: `project = ${projectId} AND fixVersion = ${
            fixVersion.id
          } ORDER BY KEY ASC`,
          pageSize: 10,
        }}
      >
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <EmptyState header="Fail" description="Error" />;
          return (
            <IssueList
              issues={data.issues.issues ? data.issues.issues : []}
              maxResults={data.issues.maxResults}
              total={data.issues.total}
              pathname={props.location.pathname}
              isLoading={loading}
            />
          );
        }}
      </Query>
    </ContentWrapper>
  );
}

// export function useIssues(jql) {
//   const [data, setData] = useState({
//     issues: [],
//     maxResults: 0,
//     total: 0,
//     loading: false,
//     error: null,
//   });
//   useEffect(() => {
//     let ignore = false;
//     fetchIssues(jql, setData, ignore);
//     return () => {
//       ignore = true;
//     };
//   }, [jql]);
//   return data;
// }

// async function fetchIssues(jql, setData, ignore) {
//   return (
//     <Query query={GET_ISSUES} variables={{ jql, pageSize: 10 }}>
//       {({ data, loading, error }) => {
//         // if (!ignore) {
//         if (loading) return setData({ loading });
//         if (error) return setData({ error });
//         return setData({
//           issues: data.issues.issues,
//           maxResults: data.issues.maxResults,
//           total: data.issues.total,
//           loading: false,
//         });
//         // }
//       }}
//     </Query>
//   );
// }
