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
import { ProjectHomeView } from '.';
import { VersionFilter } from './Filters';
import { statusCatecoryColorMap, issuetypeIconMap } from './Issue/Icon';


const ROADMAP_ROW_DATA = gql`
  fragment RoadmapRow on Issue {
    key
    summary
    issuetype {
      id
      name
    }
    status {
      name
      statusCategory {
        id
      }
    }
  }
`;

const GET_ISSUES = gql`
  query issueList($projectId: String, $versionId: String) {
    filter @client {
      project {
        id @export(as: "projectId")
      }
      version {
        id @export(as: "versionId")
      }
    }
    roadmapIssues(projectId: $projectId, versionId: $versionId) {
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

  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  const { data, loading, error } = useQuery(GET_ISSUES);

  console.table(data.roadmapIssues);

  return (
    <>
      <PageHeader
        bottomBar={(
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
        )}
      >
        Roadmap
      </PageHeader>
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
                issuetype,
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
                  <Cell singleLine>{issuetypeIconMap[issuetype.id]}</Cell>

                  <Cell singleLine>
                    <Status
                      text={status.name}
                      color={statusCatecoryColorMap[status.statusCategory.id]}
                    />
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
