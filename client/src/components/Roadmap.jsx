import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { Status } from '@atlaskit/status';
import EmptyState from '@atlaskit/empty-state';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import Button from '@atlaskit/button';
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree';
import {
  ProjectHomeView, VersionFilter, Icon,
} from '.';

const GET_FILTER = gql`
  query GetFilters {
    isLoggedIn @client
    filter @client {
      project @client {
        id
        name
      }
      version @client {
        id
        name
      }
    }
  }
`;

const ROADMAP_ROW_DATA = gql`
  fragment RoadmapRow on Issue {
    key
    summary
    type
    status {
      name
      category
    }
  }
`;

const GET_ISSUES = gql`
  query issueList($jql: String) {
    roadmapIssues(jql: $jql) {
      ...RoadmapRow
      children {
        ...RoadmapRow
        children {
          ...RoadmapRow
        }
      }
    }
  }
  ${ROADMAP_ROW_DATA}
`;


function Roadmap({ navigationViewController }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { data: { filter: { project, version } } } = useQuery(GET_FILTER);
  const barContent = (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
        <TextField isCompact placeholder="Filter" aria-label="Filter" />
      </div>
      <VersionFilter />
      <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
        <Button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
    </div>
  );

  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);


  /**
   * TODO: Adjust query for relevant results when no fixversion is selected
   */
  const jql = `(issuetype = Epic OR issueType in (Story, Task) AND "Epic Link" is not EMPTY) AND status != closed
  ${project ? `AND project = ${project.id} ` : ''}\
  ${version ? `AND fixVersion = ${version.id} ` : ''}\
  ORDER BY issuetype ASC, status DESC`;

  const { data, loading, error } = useQuery(GET_ISSUES, { variables: { jql, maxResults: 1000 } });

  return (
    <>
      <PageHeader bottomBar={barContent}>Roadmap</PageHeader>
      {error
        ? <EmptyState header={error.name} description={error.message} />
        : (
          <TableTree>
            <Headers>
              <Header width={120}>Type</Header>
              <Header width={150}>Status</Header>
              <Header width={600}>Summary</Header>
            </Headers>
            <Rows
              items={loading ? null : data.roadmapIssues}
              render={({
                key,
                summary,
                type,
                status,
                children,
              }) => (
                <Row
                  key
                  itemId={key}
                  items={children}
                  hasChildren={children && children.length > 0}
                  isDefaultExpanded={isExpanded}
                >
                  <Cell singleLine>{Icon[type]}</Cell>

                  <Cell singleLine>
                    <Status text={status.name} color={Icon[status.category]} />
                  </Cell>
                  <Cell singleLine>
                    <Link to={`/issue/${key}`}>{summary}</Link>
                  </Cell>
                </Row>
              )}
            />
          </TableTree>
        )
      }
    </>
  );
}


Roadmap.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Roadmap);
