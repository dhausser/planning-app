import React, { useContext } from 'react'
import ContentWrapper from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import BarChart from '../components/BarChart'
import { useIssues } from './Issues'
import { FilterContext } from '../context/FilterContext'
import Filters from '../components/Filters'

export default function Dashboard() {
  const { fixVersion } = useContext(FilterContext)

  const jql = `fixVersion = ${
    fixVersion.id
  } AND statusCategory in (new, indeterminate)`
  const query = `{
    issues(jql: "${jql}", pageSize: 250, after: 0) {
      startAt
      maxResults
      total
      issues {
        assignee {
          id
          name
        }
      }
    }
  }`

  const { issues, isLoading } = useIssues(query)
  return (
    <ContentWrapper>
      <PageTitle>Dashboard</PageTitle>
      <Filters />
      <ContentWrapper>
        {!isLoading && <BarChart dataset={aggregateIssues(issues)} />}
      </ContentWrapper>
    </ContentWrapper>
  )
}

function aggregateIssues(issues) {
  if (!issues) return []
  return issues.reduce((resources, issue) => {
    if (issue.assignee) {
      const name = issue.assignee.name.split(' ').shift()
      if (!resources[name]) {
        resources[name] = 0
      }
      resources[name] += 1
    }
    return resources
  }, {})
}
