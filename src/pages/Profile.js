import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import IssueList from '../components/IssueList';
import HolidayList from '../components/HolidayList';


export default class Profile extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    issues: PropTypes.array,
    resources: PropTypes.array,
  };

  getResource() {
    const { resourceId } = this.props.params;
    const { isLoading, resources } = this.context;
    let resource = null;

    if (!isLoading) {
      // TODO Support edge case when resourse not found
      resource = resources.find(({ key }) => key === resourceId);
      resource.link = `https://jira.cdprojektred.com/issues/?jql=assignee%20%3D%20${resource && resource.key}%20AND%20statusCategory%20in%20(new%2C%20indeterminate)%20and%20fixVersion%20in%20earliestUnreleasedVersionByReleaseDate(GWENT)`;
    }
    return resource;
  }

  render() {
    const { isLoading } = this.context;
    const resource = this.getResource();
    console.log(resource);

    return (
      <div>
        {!isLoading && resource != null &&
          <ContentWrapper>
            <PageTitle>
              {resource.name} {resource.team}
            </PageTitle>
            {/* <a href={resource.link} target="_blank" rel="noopener noreferrer">View in Issue Navigator</a> */}
            <IssueList issues={resource.issues} isLoading={isLoading} />
            <HolidayList holidays={resource.holidays} isLoading={isLoading} />
          </ContentWrapper>
        }
      </div>
    );
  }
};