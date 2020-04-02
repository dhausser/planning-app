import React, { useEffect, FunctionComponent } from 'react';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import EmptyState from '@atlaskit/empty-state';
import { productIssuesView, Loading } from '../components';
import { ISSUE_ROW_DATA } from '../lib/useIssues';
import {
  Header,
  Description,
  Status,
  Priority,
  FixVersions,
  UserPicker,
  Comments,
} from '../components/issue';
import { Props } from '../types';

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

const Issue: FunctionComponent<Props> = ({
  navigationViewController,
  issueId,
}) => {
  useEffect(() => navigationViewController.setView(productIssuesView.id), [
    navigationViewController,
  ]);
  const { data, loading, error } = useQuery(GET_ISSUE, {
    variables: { id: issueId },
  });

  if (loading) return <Loading />;
  if (error)
    return <EmptyState header={error.name} description={error.message} />;

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
      comment: { comments },
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
};

export default withNavigationViewController(Issue);
