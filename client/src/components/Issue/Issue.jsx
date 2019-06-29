import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';
import PropTypes from 'prop-types';

import { withNavigationViewController } from '@atlaskit/navigation-next';
import { Grid, GridColumn } from '@atlaskit/page';
import { Status } from '@atlaskit/status';
import EmptyState from '@atlaskit/empty-state';
import Summary from './Summary';
import Description from './Description';
import Assignee from './Assignee';
import UserPicker from './UserPicker';
import Comments from './Comments';
import Icon from './Icon';
import { ProductIssuesView, Loading } from '..';
import { GET_ISSUE } from '../../queries';

import { host } from '../../config';

function Issue({ navigationViewController, match }) {
  useEffect(() => {
    navigationViewController.setView(ProductIssuesView.id);
  }, [navigationViewController]);

  const {
    data: { issue },
    loading,
    error,
  } = useQuery(GET_ISSUE, {
    variables: { id: match.params.issueId },
  });

  if (loading) return <Loading />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Grid>
      <GridColumn medium={8}>
        <Summary id={issue.key} summary={issue.summary} type={issue.type} />
        <Description description={issue.description} />
        <Comments comments={issue.comments} />
      </GridColumn>
      <GridColumn medium={4}>
        <a
          href={`https://${host}/browse/${issue.key}`}
          target="_blank"
          rel="noopener noreferrer"
        >
            View in Issue Navigator
        </a>
        <p>Status</p>
        <Status
          text={issue.status.name}
          color={Icon[issue.status.category]}
        />
        <p>Assignee</p>
        <UserPicker assignee={issue.assignee} />
        <p>FixVersion</p>
        {issue.fixVersions[0] && issue.fixVersions[0].name}
        <p>Priotity</p>
        {Icon[issue.priority]}
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