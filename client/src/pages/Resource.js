import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Avatar from '@atlaskit/avatar';
import Calendar from '@atlaskit/calendar';
import { Padding } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import IssueList from '../components/IssueList';
import { NameWrapper, AvatarWrapper } from '../components/ResourceList';

export default class Resource extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    jql: PropTypes.string,
    issues: PropTypes.array,
    resources: PropTypes.array,
  };

  static propTypes = {
    params: PropTypes.object,
  };

  getResource() {
    const { resourceId } = this.props.params;
    const { isLoading, resources } = this.context;

    if (!isLoading) {
      // TODO Support edge case when resourse not found
      return resources.find(({ key }) => key === resourceId);
    }
    return null;
  }

  render() {
    const { isLoading, jql } = this.context;
    const { resourceId } = this.props.params;
    const url = new URL(
      encodeURI(`?jql=${jql} AND assignee=${resourceId}`),
      'https://jira.cdprojektred.com/issues/'
    );
    const resource = this.getResource();

    if (isLoading) return <p>Loading...</p>;
    if (!resource) return <p>This person doesn't exist</p>;
    const { issues, holidays } = resource;
    // TODO: Get Holidays date in format YYYY-MM-DD
    const dates = holidays.map(({ date }) =>
      date.replace('T00:00:00.000Z', '')
    );
    return (
      <Padding>
        <PageTitle>
          <NameWrapper>
            <AvatarWrapper>
              <Avatar
                name={resource.name}
                size="large"
                src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${encodeURIComponent(
                  resource.key
                )}`}
              />
            </AvatarWrapper>
            {resource.name}
          </NameWrapper>
        </PageTitle>
        <a href={url.href} target="_blank" rel="noopener noreferrer">
          View in Issue Navigator
        </a>
        <IssueList issues={issues} isLoading={isLoading} />
        <h3>Holiday Calendar</h3>
        <Calendar day={0} defaultDisabled={dates} />
      </Padding>
    );
  }
}
