import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree';
import Spinner from '@atlaskit/spinner';

import { fetchIssues, convertIssues } from '../modules/Helpers';
import ContentWrapper, { Center } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';

/**
 * TODO: Fetch Issues in Epic and attach Issues to Epic
 */
// fetchData(
//   {
//     jql: `"Epic Link" in (${epics.issues[0].key})`,
//     fields: [
//       'summary',
//       'status',
//       'issuetype',
//       'priority',
//       'subtasks',
//       'customfield_18404',
//     ],
//   },
//   setStories,
//   ignore
// );
// epics.issues.forEach(issue => {
//   issue.children = [];
// });
// epics.issues[0].children = stories.issues;

export default function Roadmap() {
  const [epics, setEpics] = useState({ issues: [], isLoading: true });
  // const [stories, setStories] = useState({ issues: [], isLoading: true });

  useEffect(() => {
    let ignore = false;

    fetchIssues(
      {
        jql: `project=GWENT and issuetype in (epic) and fixVersion in (${15900})`,
        fields: ['summary', 'status', 'issuetype', 'priority'],
      },
      setEpics,
      ignore
    );

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <ContentWrapper>
      <PageTitle>Roadmap</PageTitle>
      <Filters />
      {epics.isLoading ? (
        <Center>
          <Spinner size="large" />
        </Center>
      ) : (
        <TableTree>
          <Headers>
            <Header width={150}>Type</Header>
            <Header width={800}>Summary</Header>
            <Header width={100}>Value</Header>
            <Header width={200}>Status</Header>
          </Headers>
          <Rows
            items={convertIssues(epics.issues)}
            render={({ type, key, summary, value, status, children }) => (
              <Row
                expandLabel="Expand"
                collapseLabel="Collapse"
                itemId={key}
                items={children}
                hasChildren={children && children.length > 0}
              >
                <Cell singleLine>{type}</Cell>
                <Cell singleLine>
                  {<Link to={`/issue/${key}`}>{summary}</Link>}
                </Cell>
                <Cell singleLine>{value}</Cell>
                <Cell singleLine>{status}</Cell>
              </Row>
            )}
          />
        </TableTree>
      )}
    </ContentWrapper>
  );
}
