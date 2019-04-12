import React, { useContext } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import BarChart from '../components/BarChart';
import { useIssues } from './Issues';
import { FilterContext } from '../context/FilterContext';
import Filters from '../components/Filters';

export default function Dashboard() {
  const { fixVersion } = useContext(FilterContext);
  const { issues, isLoading } = useIssues(
    `fixVersion = ${fixVersion.id} AND statusCategory in (new, indeterminate)`
  );
  return (
    <ContentWrapper>
      <PageTitle>Dashboard</PageTitle>
      <Filters />
      <ContentWrapper>
        {!isLoading && <BarChart dataset={aggregateIssues(issues)} />}
      </ContentWrapper>
    </ContentWrapper>
  );
}

function aggregateIssues(issues) {
  if (!issues) return [];
  return issues.reduce((resources, issue) => {
    if (issue.fields.assignee) {
      const name = issue.fields.assignee.displayName.split(' ').shift();
      if (!resources[name]) {
        resources[name] = 0;
      }
      resources[name] += 1;
    }
    return resources;
  }, {});
}
