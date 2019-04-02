import React, { useState, useEffect } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import BarChart from '../components/BarChart';
import { fetchIssues } from '../modules/Helpers';

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

export default function Dashboard() {
  const [data, setData] = useState({
    issues: [],
    maxResults: 0,
    total: 0,
    isLoading: true,
  });
  useEffect(() => {
    let ignore = false;

    fetchIssues(
      {
        jql: 'fixVersion = 15900 AND statusCategory in (new, indeterminate)',
        fields: ['assignee'],
      },
      setData,
      ignore
    );
    return () => {
      ignore = true;
    };
  }, []);
  return (
    <ContentWrapper>
      <PageTitle>Dashboard</PageTitle>
      <Filters />
      <ContentWrapper>
        {!data.isLoading && <BarChart dataset={aggregateIssues(data.issues)} />}
      </ContentWrapper>
    </ContentWrapper>
  );
}
