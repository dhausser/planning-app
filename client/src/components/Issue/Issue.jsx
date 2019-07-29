import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withNavigationViewController } from '@atlaskit/navigation-next';
// import { Grid, GridColumn } from '@atlaskit/page';
import { Status } from '@atlaskit/status';
import EmptyState from '@atlaskit/empty-state';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from '@atlaskit/avatar';
import Summary from './Summary';
import Description from './Description';
import UserPicker from './UserPicker';
import Comments from './Comments';
import { statusCatecoryColorMap, priorityIconMap } from './Icon';
import { ProductIssuesView, Loading } from '..';
import { ISSUE_ROW_DATA } from '../Issues/Issues';

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
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
          avatarUrls {
            small
          }
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
    <>
      <Summary id={key} summary={summary} issuetype={issuetype} />
      <p>Description</p>
      <Description id={id} description={description} />
      <p>Assignee</p>
      <UserPicker {...issue} issueKey={key} />
      <p>Reporter</p>
      <NameWrapper>
        <AvatarWrapper>
          <Avatar
            name={reporter.displayName}
            size="small"
            src={reporter.avatarUrls.small}
          />
        </AvatarWrapper>
        <Link to={`/resource/${reporter.key}`}>{reporter.displayName}</Link>
      </NameWrapper>
      <p>Status</p>
      <Status
        text={status.name}
        color={statusCatecoryColorMap[status.statusCategory.id]}
      />
      <p>FixVersion</p>
      {fixVersions[0] && fixVersions[0].name}
      <p>Priority</p>
      {priorityIconMap[priority.id]}
      <Comments comments={comments} />
    </>
  );
}

Issue.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
  match: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Issue);
