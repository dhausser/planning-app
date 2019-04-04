import React, { useState, useContext } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import BarChart from '../components/BarChart';
import { useIssues } from './Issues';
import FilterContext from '../context/FilterContext';

export default function Dashboard() {
  const filterContext = useContext(FilterContext);
  const [fixVersion, setFixVersion] = useState(filterContext.fixVersion);
  const { issues, isLoading } = useIssues(
    `fixVersion = ${fixVersion.id} AND statusCategory in (new, indeterminate)`
  );
  return (
    <ContentWrapper>
      <PageTitle>Dashboard</PageTitle>
      <Filters fixVersion={fixVersion} setFixVersion={setFixVersion} />
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
