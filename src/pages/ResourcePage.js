import React from 'react';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import IssueList from '../components/IssueList';
import HolidayList from '../components/HolidayList';

export default (props) => {
  const { resourceId } = props.params;
  const { resources } = props;
  const resource = resources.find(resource => resource.key === resourceId);
  let content = '';

  if (resource) {
    const { name, team, issues, holidays } = resource;
    const host = "https://jira.cdprojektred.com/";
    const path = "issues/?jql="
    const jql = `assignee%20%3D%20${resource.key}%20AND%20statusCategory%20in%20(new%2C%20indeterminate)`;
    content = (
      <ContentWrapper>
        <PageTitle>{name} - {team}</PageTitle>
        <a href={`${host}${path}${jql}`} target="_blank" rel="noopener noreferrer">View in Issue Navigator</a>
        <IssueList issues={issues} />
        <HolidayList holidays={holidays} name={name} team={team} />
      </ContentWrapper>
    );
  }

  return (
    content
  )

}