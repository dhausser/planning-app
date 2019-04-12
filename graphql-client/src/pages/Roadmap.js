import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree';
import Spinner from '@atlaskit/spinner';
import { Status } from '@atlaskit/status';
import ContentWrapper, { Center } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import { getIcon } from '../components/Helpers';
import { fetchIssues } from './Issues';
import { FilterContext } from '../context/FilterContext';
import Filters from '../components/Filters';

export default function Roadmap() {
  const { fixVersion } = useContext(FilterContext);
  const epics = useIssues(
    `project = 10500 AND fixVersion = ${fixVersion.id} AND issuetype = epic`
  );
  const stories = useIssues(
    `project = 10500 AND fixVersion = ${
      fixVersion.id
    } AND "Epic Link" in (${epics.issues.map(({ id }) => id)})`
  );
  return (
    <ContentWrapper>
      <PageTitle>Roadmap</PageTitle>
      <Filters />
      {stories.isLoading ? (
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

function useIssues(jql) {
  const [data, setData] = useState({ issues: [], isLoading: true });
  useEffect(() => {
    let ignore = false;
    fetchIssues(
      {
        jql,
        fields: ['summary', 'status', 'issuetype', 'priority'],
      },
      setData,
      ignore
    );
    return () => {
      ignore = true;
    };
  }, [jql]);
  return data;
}

function convertIssues(issues) {
  return issues.map(issue => ({
    type: getIcon[issue.fields.issuetype.name],
    key: issue.key,
    summary: issue.fields.summary,
    value: getIcon[issue.fields.priority.name],
    status: (
      <Status
        text={issue.fields.status.name}
        color={getIcon[issue.fields.status.statusCategory.key]}
      />
    ),
    children:
      issue.children &&
      issue.children.map(child => ({
        type: getIcon[child.fields.issuetype.name],
        key: child.key,
        summary: child.fields.summary,
        value: getIcon[child.fields.priority.name],
        status: (
          <Status
            text={child.fields.status.name}
            color={getIcon[child.fields.status.statusCategory.key]}
          />
        ),
        children: child.fields.subtasks.map(subtask => ({
          type: getIcon[subtask.fields.issuetype.name],
          key: subtask.key,
          summary: subtask.fields.summary,
          value: getIcon[subtask.fields.priority.name],
          status: (
            <Status
              text={subtask.fields.status.name}
              color={getIcon[subtask.fields.status.statusCategory.key]}
            />
          ),
          children: [],
        })),
      })),
  }));
}
