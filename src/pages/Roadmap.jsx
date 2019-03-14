import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import TableTree, { Headers, Header, Rows, Row, Cell } from '@atlaskit/table-tree';
import { Status } from '@atlaskit/status';
import { statusColor } from '../components/IssueList';

export default class Roadmap extends Component {
  state = {
    issues: [],
  }

  static contextTypes = {
    isLoading: PropTypes.bool,
  };

  componentDidMount = async () => {
    const jql = 'project=GWENT AND issuetype=Story AND fixVersion=2.0';
    const response = await fetch(`api/search?jql=${jql}`);
    const issues = await response.json();
    this.setState({ issues });
  }

  // TODO assign maps subtasks as children
  convertIssues = () => {
    return this.state.issues.map(issue => (
      {
        key: issue.key,
        summary: issue.summary,
        value: issue.priority,
        status: <Status text={issue.status} color={statusColor(issue.statusCategory)} />,
        children: [
          {
            key: 'subtask',
            summary: 'Sample subtask',
            value: 'P4',
            status: 'to do',
            children: []
          }
        ]
      }
    ))
  }

  render() {
    const { isLoading } = this.context;

    return (
      <ContentWrapper>
        <PageTitle>Roadmap</PageTitle>
        {!isLoading &&
          <TableTree>
            <Headers>
              <Header width={300}>Summary</Header>
              <Header width={100}>Value</Header>
              <Header width={100}>Status</Header>
            </Headers>
            <Rows
              items={this.convertIssues()}
              render={({ key, summary, value, status, children }) => (
                <Row
                  expandLabel={'Expand'}
                  collapseLabel={'Collapse'}
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
        }
      </ContentWrapper>
    )
  }
};