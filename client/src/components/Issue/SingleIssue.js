import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';

// Atlaskit
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import EmptyState from '@atlaskit/empty-state';

// Components
import Header from './Header';
import Description from './Description';
import Status from './Status';
import Priority from './Priority';
import FixVersions from './FixVersions';
import UserPicker from './UserPicker';
import Comments from './Comments';
import { ProductIssuesView, Loading } from '..';
import { ISSUE_ROW_DATA } from '../Issues/Issues';

const Padding = styled.div`
  padding: 0px 0px 0px 40px;
`;

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
  useEffect(() => navigationViewController.setView(ProductIssuesView.id),
    [navigationViewController]);
  const { data: { issue }, loading, error } = useQuery(GET_ISSUE, {
    variables: { id: match.params.issueId },
  });

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
    <Page>
      <Padding>
        <Grid layout="fluid">
          <GridColumn medium={10}>
            <Header id={key} summary={summary} issuetype={issuetype} />
            <Description id={id} description={description} />
            <Comments comments={comments} />
          </GridColumn>
          <GridColumn medium={2}>
            <Status {...status} />
            <UserPicker id={id} user={assignee} type="assignee" />
            <UserPicker id={id} user={reporter} type="reporter" />
            <FixVersions fixVersions={fixVersions} />
            <Priority {...priority} />
          </GridColumn>
        </Grid>
      </Padding>
    </Page>
  );
}

Issue.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
  match: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Issue);
