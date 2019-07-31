import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

// Atlaskit
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { Status } from '@atlaskit/status';
import EmptyState from '@atlaskit/empty-state';
import Lozenge from '@atlaskit/lozenge';
import { Grid, GridColumn } from '@atlaskit/page';

// Components
import Summary from './Summary';
import Description from './Description';
import UserPicker from './UserPicker';
import Comments from './Comments';
import { statusCatecoryColorMap, priorityIconMap } from './Icon';
import { ProductIssuesView, Loading } from '..';
import { ISSUE_ROW_DATA } from '../Issues/Issues';

const GET_ISSUE = gql`
  query GetIssueById($id: ID!) {
    issue(id: $id) {
      ...IssueRow
      fields {
        description
        assignee {
          avatarUrls {
            small
          }
        }
        reporter {
          key
          displayName
        }
        comment {
          comments {
            id
            author {
              key
              displayName
            }
            body
            created
            updated
          }
        }
      }
    }
  }
  ${ISSUE_ROW_DATA}
`;

const Wrapper = props => (
  <div style={{ padding: '4px', display: 'block' }} {...props} />
);

function Issue({ navigationViewController, match }) {
  const { data: { issue }, loading, error } = useQuery(GET_ISSUE, {
    variables: { id: match.params.issueId },
  });

  useEffect(() => {
    navigationViewController.setView(ProductIssuesView.id);
  }, [navigationViewController]);

  if (loading) return <Loading />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  const {
    id,
    key,
    fields: {
      summary,
      description,
      assignee,
      reporter,
      issuetype,
      status,
      priority,
      fixVersions,
      comment: {
        comments,
      },
    },
  } = issue;

  return (
    <Grid layout="fluid">
      <GridColumn medium={10}>
        <Summary id={key} summary={summary} issuetype={issuetype} />
        <p>Description</p>
        <Description id={id} description={description} />
        <Comments comments={comments} />
      </GridColumn>
      <GridColumn medium={2}>
        <p>Assignee</p>
        <UserPicker id={id} issueKey={key} user={assignee} />
        <p>Reporter</p>
        <UserPicker id={id} issueKey={key} user={reporter} />
        <p>Status</p>
        <Status
          text={status.name}
          color={statusCatecoryColorMap[status.statusCategory.id]}
        />
        <p>FixVersion</p>
        <Lozenge appearance="default">{fixVersions[0].name}</Lozenge>
        <p>Priority</p>
        {priorityIconMap[priority.id]}
      </GridColumn>
    </Grid>
  );
}

Issue.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
  match: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Issue);
