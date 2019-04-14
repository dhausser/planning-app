import React, { useState, useContext, useEffect } from 'react'
import EmptyState from '@atlaskit/empty-state'
import ContentWrapper from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import IssueList from '../components/IssueList'
import { FilterContext } from '../context/FilterContext'
import Filters from '../components/Filters'
import { projectId } from '../credentials.json'

/**
 * TODO: Implement team filter
 */
// function filterIssues() {
//   const { issues, resources, team } = this.context;
//   if (team != null) {
//     const resourceFilter = resources
//       .filter(resource => resource.team === team)
//       .map(({ key }) => key);
//     return issues.filter(issue =>
//       resourceFilter.includes(issue.fields.assignee.key)
//     );
//   }
//   return issues;
// }

export default function Issues(props) {
  // const { fixVersion } = useContext(FilterContext)
  const { issues, maxResults, total, isLoading } = useIssues(
    `project = ${projectId}` // AND fixVersion = ${fixVersion.id}`
  )
  return (
    <ContentWrapper>
      <PageTitle>Issues</PageTitle>
      <Filters />
      {issues ? (
        <IssueList
          issues={issues}
          maxResults={maxResults}
          total={total}
          pathname={props.location.pathname}
          isLoading={isLoading}
        />
      ) : (
        <EmptyState
          header="Fail"
          description="Something must be wrong with the request."
        />
      )}
    </ContentWrapper>
  )
}

export function useIssues(jql) {
  const [data, setData] = useState({
    issues: [],
    maxResults: 0,
    total: 0,
    isLoading: true,
  })
  useEffect(() => {
    let ignore = false
    fetchIssues(jql, setData, ignore)
    return () => {
      ignore = true
    }
  }, [jql])
  return data
}

export async function fetchIssues(jql, setData, ignore) {
  const query = `{
    issues(jql: "${jql}", pageSize: 10, after: 0) {
      startAt
      maxResults
      total
      issues {
        id
        key
        summary
        type
        priority
        status {
          name
          category
        }
        fixVersions {
          id
          name
        }
        assignee {
          id
          name
        }
      }
    }
  }`
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  const {
    data: { issues },
  } = await response.json()
  if (!ignore) setData({ ...issues, isLoading: false })
}
