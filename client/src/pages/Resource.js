import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Avatar from '@atlaskit/avatar';
import Calendar from '@atlaskit/calendar';
import EmptyState from '@atlaskit/empty-state';
import Spinner from '@atlaskit/spinner';

import ContentWrapper, {
  NameWrapper,
  AvatarWrapper,
  Center,
} from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import IssueList from '../components/IssueList';
import Filters from '../components/Filters';

export default class Resource extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    issues: PropTypes.array,
    resources: PropTypes.array,
  };

  static propTypes = {
    params: PropTypes.object,
  };

  getResource() {
    const { resourceId } = this.props.params;
    const { resources } = this.context;
    return resources.find(({ key }) => key === resourceId);
  }

  render() {
    const { isLoading, jql } = this.context;
    const { resourceId } = this.props.params;

    if (isLoading)
      return (
        <Center>
          <Spinner size="large" />;
        </Center>
      );
    const resource = this.getResource();
    if (!resource)
      return (
        <EmptyState
          header="This person doesn't exist"
          description={`The person you are trying to lookup isn't currently recorded in the database.`}
        />
      );

    const issues = this.context.issues.filter(
      issue => issue.fields.assignee.key === resource.key
    );

    const { holidays } = resource;
    /**
     * Get Holidays date in format YYYY-MM-DD
     */
    const dates = holidays.map(({ date }) =>
      date.replace('T00:00:00.000Z', '')
    );

    return (
      <ContentWrapper>
        <PageTitle>
          <NameWrapper>
            <AvatarWrapper>
              <Avatar
                name={resource.name}
                size="large"
                src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${
                  resource.key
                }`}
              />
            </AvatarWrapper>
            {resource.name}
          </NameWrapper>
        </PageTitle>
        <Filters />
        <a
          href={`https://jira.cdprojektred.com/issues/?jql=${jql} AND assignee=${resourceId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View in Issue Navigator
        </a>
        <IssueList issues={issues} isLoading={isLoading} />
        <h3>Holiday Calendar</h3>
        <Calendar day={0} defaultDisabled={dates} />
      </ContentWrapper>
    );
  }
}
