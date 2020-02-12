import React, { useEffect } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import PropTypes from 'prop-types';
import styled from 'styled-components';

// Atlaskit
import { withNavigationViewController } from '@atlaskit/navigation-next';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import EmptyState from '@atlaskit/empty-state';

// Components
import { ProductIssuesView, Loading } from '../components';
import { ISSUE_ROW_DATA } from './issues';
import {
  Header,
  Description,
  Status,
  Priority,
  FixVersions,
  UserPicker,
  Comments,
} from '../components/Issue';

const Padding = styled.div`
  padding: 40px 0px 0px 40px;
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
  const { data, loading, error } = useQuery(GET_ISSUE, {
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
  } = data.issue;

  return (
    <Page>
      <Padding>
        <Grid layout="fluid">
          <GridColumn medium={8}>
            <Header id={key} summary={summary} issuetype={issuetype} />
            <Description id={id} description={description} />
            <Comments comments={comments} />
          </GridColumn>
          <GridColumn medium={4}>
            <Status name={status.name} statusCategory={status.statusCategory} />
            <UserPicker id={id} user={assignee} type="assignee" />
            <UserPicker id={id} user={reporter} type="reporter" />
            <FixVersions fixVersions={fixVersions} />
            <Priority id={priority.id} />
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
