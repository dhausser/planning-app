import React, {
  useState,
  useEffect,
  FunctionComponent,
  ReactElement,
} from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
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
  projectHomeView,
  Layout,
  VersionFilter,
  statusCatecoryColorMap,
  issuetypeIconMap,
} from '../components';
import { Props, RowProps } from '../types';

const ROADMAP_ROW_DATA = gql`
  fragment RoadmapRow on Issue {
    key
    fields {
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
  }
`;

const GET_ISSUES = gql`
  query issueList($projectId: String, $versionId: String) {
    projectId @client @export(as: "projectId")
    versionId @client @export(as: "versionId")
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

const Backlog: FunctionComponent<Props> = ({ navigationViewController }) => {
  useEffect(() => navigationViewController.setView(projectHomeView.id), [
    navigationViewController,
  ]);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, loading, error } = useQuery(GET_ISSUES);

  return (
    <Layout>
      <PageHeader
        bottomBar={
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '0 0 200px', marginRight: 8 }}>
              <TextField isCompact placeholder="Filter" aria-label="Filter" />
            </div>
            <VersionFilter />
            <div style={{ flex: '0 0 200px', marginRight: 8 }}>
              <Button onClick={(): void => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          </div>
        }
      >
        Backlog
      </PageHeader>
      {error ? (
        <EmptyState header={error.name} description={error.message} />
      ) : (
        <TableTree>
          <Headers>
            <Header width={120}>Type</Header>
            <Header width={700}>Summary</Header>
            <Header width={150}>Status</Header>
          </Headers>
          <Rows
            items={loading ? null : data.roadmapIssues}
            render={({ key, fields, children }: RowProps): ReactElement => (
              <Row
                key
                itemId={key}
                items={children}
                hasChildren={children && children.length > 0}
                isDefaultExpanded={isExpanded}
              >
                <Cell singleLine>{issuetypeIconMap[fields.issuetype.id]}</Cell>
                <Cell singleLine>
                  <Link to={`/issue/${key}`}>{fields.summary}</Link>
                </Cell>
                <Cell singleLine>
                  <Status
                    text={fields.status.name}
                    color={
                      statusCatecoryColorMap[fields.status.statusCategory.id]
                    }
                  />
                </Cell>
              </Row>
            )}
          />
        </TableTree>
      )}
    </Layout>
  );
};

export default withNavigationViewController(Backlog);
