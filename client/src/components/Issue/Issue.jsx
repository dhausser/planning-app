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
import Header from './Header';
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
        <Header id={key} summary={summary} issuetype={issuetype} />
        <h5>Description</h5>
        <Description id={id} description={description} />
        <h5>Activity</h5>
        <Comments comments={comments} />
      </GridColumn>
      <GridColumn medium={2}>
        <h6>STATUS</h6>
        <Status
          text={status.name}
          color={statusCatecoryColorMap[status.statusCategory.id]}
        />
        <h6>ASSIGNEE</h6>
        <UserPicker id={id} user={assignee} />
        <h6>REPORTER</h6>
        <UserPicker id={id} user={reporter} />
        <h6>Fix Versions</h6>
        <Lozenge appearance="default">{fixVersions[0].name}</Lozenge>
        <h6>Priority</h6>
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
