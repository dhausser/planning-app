import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import TableTree, { Headers, Header, Rows, Row, Cell } from '@atlaskit/table-tree';
import { Status } from '@atlaskit/status';
import { statusColor } from '../components/IssueList';

export default class Roadmap extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    issues: PropTypes.array,
  };

  render() {
    const { isLoading } = this.context;
    const issues = this.context.issues.filter(({ issuetype }) => issuetype === 'Story');
    const items = issues.map(issue => (
      {
        key: issue.key,
        summary: issue.summary,
        value: issue.priority,
        status: <Status text={issue.status} color={statusColor(issue)} />,
        children: [
          {
            key: `${issue.key}-subtask`,
            summary: `${issue.key} Sample subtask`,
            value: issue.priority,
            status: <Status text={issue.status} color={statusColor(issue)} />,
            children: []
          }
        ]
      }
    ))
  
    console.log(items);
  
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
              items={items}
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