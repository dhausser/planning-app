import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import IssueList from '../components/IssueList';
import HolidayList from '../components/HolidayList';

export default class Profile extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    resources: PropTypes.array,
  };

  render() {
    const { resourceId } = this.props.params;
    const { resources, isLoading } = this.context;
    let link = null;
    let resource = null;

    if (!isLoading) {
      resource = resources.find(({ key }) => key === resourceId);
      link = `https://${process.env.HOSTNAME}/issues/?jql=assignee%20%3D%20${resource.key}%20AND%20statusCategory%20in%20(new%2C%20indeterminate)%20and%20fixVersion%20in%20earliestUnreleasedVersionByReleaseDate(GWENT)`;
    }

    return (
      <ContentWrapper>
        {!isLoading
          && (
            <div>
              <PageTitle>
                {resource && resource.name}
                {' '}
                -
                {' '}
                {resource && resource.team}
              </PageTitle>
              <a href={link} target="_blank" rel="noopener noreferrer">View in Issue Navigator</a>
              <IssueList issues={resource && resource.issues} isLoading={isLoading} />
              <HolidayList holidays={resource && resource.holidays} isLoading={isLoading} />
            </div>
          )
        }
      </ContentWrapper>
    );
  }
};