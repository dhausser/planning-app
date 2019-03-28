import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree';
import Spinner from '@atlaskit/spinner';

import { getIssues, convertIssues } from '../modules/Helpers';
import ContentWrapper, { Center } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';

export default class Roadmap extends Component {
  state = {
    isLoading: true,
    issues: [],
  };

  static contextTypes = {
    isLoading: PropTypes.bool,
    fixVersions: PropTypes.array,
  };

  componentDidMount = async () => {
    /**
     * TODO: Wait till request is fetched
     */
    // const { fixVersions } = this.context;
    // console.log(fixVersions.map(({ id }) => id));

    let data = {
      jql: `project=GWENT and issuetype in (epic) and fixVersion in (${15900})`,
      maxResults: 10,
      fields: ['summary', 'status', 'issuetype', 'priority'],
    };
    const { issues } = await getIssues(data);

    data = {
      jql: `"Epic Link" in (${issues[0].key})`,
      // maxResults: 10,
      fields: [
        'summary',
        'status',
        'issuetype',
        'priority',
        'subtasks',
        'customfield_18404',
      ],
    };
    const response = await getIssues(data);
    const children = response.issues;

    issues.forEach(issue => {
      issue.children = [];
    });
    issues[0].children = children;

    /**
     * TODO: Attached issues in epic to epic
     */
    // children.forEach(child => {
    //   console.log(child.fields);
    // });

    this.setState({ issues, isLoading: false });
  };

  render() {
    const { issues, isLoading } = this.state;
    return (
      <ContentWrapper>
        <PageTitle>Roadmap</PageTitle>
        <Filters />
        {isLoading ? (
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
              items={convertIssues(issues)}
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
        )}
      </ContentWrapper>
    );
  }
}
