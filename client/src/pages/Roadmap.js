import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree';
import Spinner from '@atlaskit/spinner';
import EmptyState from '@atlaskit/empty-state';
import { Status } from '@atlaskit/status';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import { getIcon } from '../components/Icon';
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
      }
    }
  }
`;

export default function Roadmap() {
  const { fixVersion } = useContext(FilterContext);
  const epicsJql = `project = ${projectId} AND fixVersion = ${
    fixVersion.id
  } AND issuetype = epic`;
  return (
    <ContentWrapper>
      <PageTitle>Roadmap</PageTitle>
      <Filters />
      <Query query={GET_ISSUES} variables={{ jql: epicsJql, pageSize: 10 }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error)
            return (
              <EmptyState
                header="Fail"
                description="Something must be wrong with the request."
              />
            );
          return (
            <TableTree>
              <Headers>
                <Header width={150}>Type</Header>
                <Header width={800}>Summary</Header>
                <Header width={100}>Value</Header>
                <Header width={200}>Status</Header>
              </Headers>
              <Rows
                items={convertIssues(data.issues.issues)}
                render={({ type, key, summary, value, status, children }) => (
                  // if (type === 'Epic') {
                  //   <Query
                  //     query={GET_ISSUES}
                  //     variables={{ jql: `"Epic Link"=${key}`, pageSize: 50 }}
                  //   >
                  //     {({ data, loading, error }) => data.issues.issues}
                  //   </Query>;
                  // }
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
          );
        }}
      </Query>
    </ContentWrapper>
  );
}

function convertIssues(issues) {
  return issues.map(issue => ({
    type: getIcon[issue.type],
    key: issue.key,
    summary: issue.summary,
    value: getIcon[issue.priority],
    status: (
      <Status text={issue.status.name} color={getIcon[issue.status.category]} />
    ),
    children:
      issue.children &&
      issue.children.map(child => ({
        type: getIcon[child.type],
        key: child.key,
        summary: child.summary,
        value: getIcon[child.priority],
        status: (
          <Status
            text={child.status.name}
            color={getIcon[child.status.category]}
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
