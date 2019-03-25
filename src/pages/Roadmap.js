import React, { Component } from 'react';
import { Link } from 'react-router';
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree';
import { Status } from '@atlaskit/status';
import { statusColor, typeIcon } from '../components/IssueList';
import { Padding } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';

export default class Roadmap extends Component {
  state = {
    isLoading: true,
    epics: [],
  };

  componentDidMount = async () => {
    const epicQuery = encodeURI(
      'project=GWENT and issuetype in (epic) and fixVersion=2.1'
    );
    const response = await fetch(`/api/search?jql=${epicQuery}`);
    const epics = await response.json();

    const storyQuery = encodeURI(
      `"Epic Link"=${epics[0].key}&fields=key,summary,subtasks`
    );
    const res = await fetch(`/api/search?jql=${storyQuery}`);

    // TODO: Find some better way to do this that would work for an array of epics
    const children = await res.json();
    epics[0].children = children;

    this.setState({ epics, isLoading: false });
  };

  convertIssues = issues =>
    issues.map(issue => ({
      type: typeIcon(issue.issuetype),
      key: issue.key,
      summary: issue.summary,
      value: issue.priority,
      status: (
        <Status text={issue.status} color={statusColor(issue.statusCategory)} />
      ),
      children: issue.children.map(child => ({
        type: typeIcon(child.issuetype),
        key: child.key,
        summary: child.summary,
        value: child.priority,
        status: (
          <Status
            text={child.status}
            color={statusColor(child.statusCategory)}
          />
        ),
        // TODO: Subtask current do not have the flatten formatting as other issues
        children: child.subtasks.map(subtask => ({
          type: typeIcon(subtask.fields.issuetype.name),
          key: subtask.key,
          summary: subtask.fields.summary,
          value: subtask.fields.priority.name,
          status: <Status text={subtask.fields.status.name} color="purple" />,
          children: [],
        })),
      })),
    }));

  render() {
    const { epics, isLoading } = this.state;
    if (isLoading) return <p>Loading...</p>;
    return (
      <Padding>
        <PageTitle>Roadmap</PageTitle>
        <TableTree>
          <Headers>
            <Header width={150}>Type</Header>
            <Header width={600}>Summary</Header>
            <Header width={100}>Value</Header>
            <Header width={200}>Status</Header>
          </Headers>
          <Rows
            items={this.convertIssues(epics)}
            render={({ type, key, summary, value, status, children }) => (
              <Row
                expandLabel="Expand"
                collapseLabel="Collapse"
                itemId={key}
                items={children}
                hasChildren={children.length > 0}
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
      </Padding>
    );
  }
}
