import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Padding } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import IssueList from '../components/IssueList';
import HolidayList from '../components/HolidayList';

export default class Resource extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    jql: PropTypes.string,
    issues: PropTypes.array,
    resources: PropTypes.array,
  };

  static propTypes = {
    params: PropTypes.string,
  };

  getResource() {
    const { params } = this.props;
    const { resourceId } = params;
    const { isLoading, resources } = this.context;

    if (!isLoading) {
      // TODO Support edge case when resourse not found
      return resources.find(({ key }) => key === resourceId);
    }
    return null;
  }

  render() {
    const { isLoading, jql } = this.context;
    const { params } = this.props;
    const { resourceId } = params;
    const url = new URL(
      encodeURI(`?jql=${jql} AND assignee=${resourceId}`),
      'https://jira.cdprojektred.com/issues/'
    );
    console.log(url);
    const resource = this.getResource();

    return (
      <div>
        {!isLoading && resource != null && (
          <Padding>
            <PageTitle>
              {resource.name} {resource.team}
            </PageTitle>
            <a href={url.href} target="_blank" rel="noopener noreferrer">
              View in Issue Navigator
            </a>
            <IssueList issues={resource.issues} isLoading={isLoading} />
            <HolidayList holidays={resource.holidays} isLoading={isLoading} />
          </Padding>
        )}
      </div>
    );
  }
}
