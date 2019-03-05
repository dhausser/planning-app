import React from 'react';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import IssueList from '../components/IssueList';
import HolidayList from '../components/HolidayList';

export default (props) => {
  const { resourceId } = props.params;
  const { resources } = props;
  const resource = resources.find(resource => resource.key === resourceId);

  return (
    <div>
      {resource &&
        <ContentWrapper>
          <PageTitle>{resource.name} - {resource.team}</PageTitle>
          <a href={
            `https://${process.env.HOSTNAME}
            /issues/?jql="assignee%20%3D%20
            ${resource.key}%20AND%20statusCategory%20in%20(new%2C%20indeterminate)`
          } target="_blank" rel="noopener noreferrer">View in Issue Navigator</a>
          <IssueList issues={resource.issues} />
          <HolidayList holidays={resource.holidays} />
        </ContentWrapper>
      }
    </div>
  );
}