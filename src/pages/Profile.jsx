import React from 'react';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import IssueList from '../components/IssueList';
import HolidayList from '../components/HolidayList';

const ProfilePage = props => {
  const { resourceId } = props.params;
  const { resources } = props;
  const resource = resources.find(resource => resource.key === resourceId);

  return (
    <ContentWrapper>
      {resource
        && (
          <div>
            <PageTitle>
              {resource.name}
              {' '}
              -
            {' '}
              {resource.team}
            </PageTitle>
            <a href={`https://jira.cdprojektred.com/issues/?jql=assignee%20%3D%20${resource.key}%20AND%20statusCategory%20in%20(new%2C%20indeterminate)%20and%20fixVersion%20in%20earliestUnreleasedVersionByReleaseDate(GWENT)`} target="_blank" rel="noopener noreferrer">View in Issue Navigator</a>
            <IssueList issues={resource.issues} />
            <HolidayList holidays={resource.holidays} />
          </div>
        )
      }
    </ContentWrapper>
  );
};

export default ProfilePage;