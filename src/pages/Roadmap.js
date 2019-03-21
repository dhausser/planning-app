import React, { Component } from 'react';
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree';
import { Status } from '@atlaskit/status';
import { statusColor } from '../components/IssueList';
import { Padding } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';

export default class Roadmap extends Component {
  state = {
    isLoading: true,
    issues: [],
  };

  componentDidMount = async () => {
    const jql = encodeURI(
      'project=GWENT and issuetype in (story) and fixVersion in earliestUnreleasedVersionByReleaseDate(GWENT)'
    );
    const response = await fetch(`/api/search?jql=${jql}`);
    const issues = await response.json();
    this.setState({ issues, isLoading: false });
  };

  // TODO assign maps subtasks as children
  convertIssues = issues =>
    issues.map(issue => ({
      key: issue.key,
      summary: issue.summary,
      value: issue.priority,
      status: (
        <Status text={issue.status} color={statusColor(issue.statusCategory)} />
      ),
      children: [
        {
          key: 'subtask',
          summary: 'Sample subtask',
          value: 'P4',
          status: 'to do',
          children: [],
        },
      ],
    }));

  render() {
    const { isLoading, issues } = this.state;

    return (
      <Padding>
        <PageTitle>Roadmap</PageTitle>
        {!isLoading && (
          <TableTree>
            <Headers>
              <Header width={300}>Summary</Header>
              <Header width={100}>Value</Header>
              <Header width={100}>Status</Header>
            </Headers>
            <Rows
              items={this.convertIssues(issues)}
              render={({ key, summary, value, status, children }) => (
                <Row
                  expandLabel="Expand"
                  collapseLabel="Collapse"
                  itemId={key}
                  items={children}
                  hasChildren={children.length > 0}
                >
                  <Cell singleLine>{summary}</Cell>
                  <Cell singleLine>{value}</Cell>
                  <Cell singleLine>{status}</Cell>
                </Row>
              )}
            />
          </TableTree>
        )}
      </Padding>
    );
  }
}
