import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { Grid, GridColumn } from '@atlaskit/page';
import { Status } from '@atlaskit/status';
import EmptyState from '@atlaskit/empty-state';
import Summary from './Summary';
import Description from './Description';
import Assignee from './Assignee';
import UserPicker from './UserPicker';
import Comments from './Comments';
import { statusCatecoryColorMap, priorityIconMap } from './Icon';
import { ProductIssuesView, Loading } from '..';

const ISSUE_TILE_DATA = gql`
  fragment IssueTile on Issue {
    id
    key
    summary
    issuetype {
      id
      name
    }
    priority {
      id
      name
    }
    status {
      name
      statusCategory {
        id
      }
    }
    fixVersions {
      id
      name
    }
    assignee {
      key
      name
      team
    }
  }
`;

const GET_ISSUE = gql`
  query GetIssueById($id: ID!) {
    issue(id: $id) {
      ...IssueTile
      description
      reporter {
        key
        name
      }
      comments {
        id
        author {
          key
          name
        }
        body
        created
        updated
      }
    }
  }
  ${ISSUE_TILE_DATA}
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

  return (
    <Grid>
      <GridColumn medium={8}>
        <Summary id={issue.key} summary={issue.summary} issuetypeId={issue.issuetype.id} />
        <Description description={issue.description} />
        <Comments comments={issue.comments} />
      </GridColumn>
      <GridColumn medium={4}>
        <a
          href={`https://${process.env.REACT_APP_HOST}/browse/${issue.key}`}
          target="_blank"
          rel="noopener noreferrer"
        >
            View in Issue Navigator
        </a>
        <p>Status</p>
        <Status
          text={issue.status.name}
          color={statusCatecoryColorMap[issue.status.statusCategory.id]}
        />
        <p>Assignee</p>
        <UserPicker assignee={issue.assignee} />
        <p>FixVersion</p>
        {issue.fixVersions[0] && issue.fixVersions[0].name}
        <p>Priotity</p>
        {priorityIconMap[issue.priority.id]}
        <p>Reporter</p>
        <Assignee assignee={issue.reporter} />
      </GridColumn>
    </Grid>
  );
}

Issue.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
  match: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Issue);
