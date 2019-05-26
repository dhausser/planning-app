import React from 'react'
import { useQuery } from 'react-apollo-hooks'

import Button from '@atlaskit/button'
import { Loading, Error } from '..'
import IssueList from './IssueList'
import { GET_ISSUES, GET_FILTERS, GET_TEAMS } from '../queries'

export default function(props) {
  const { data, loading, error } = useQuery(GET_FILTERS)

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return <Teams {...props} filters={data} />
}

function Teams(props) {
  const { data, loading, error } = useQuery(GET_TEAMS, {
    fetchPolicy: 'cache-first',
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return <Issues {...props} teams={data.teams} />
}

function Issues({ filters, teams, match, pageSize }) {
  const { project, version, team } = filters
  const { resourceId } = match.params

  const assignee =
    resourceId != null
      ? resourceId
      : team && teams
      ? teams.find(({ _id }) => _id === team.id).members.map(({ key }) => key)
      : null

  const jql = `${project ? `project=${project.id} and` : ''}\
    ${version ? `fixVersion in (${version.id}) and` : ''}\
    ${assignee ? `assignee in (${assignee}) and` : ''}\
    statusCategory in (new, indeterminate)\
    order by priority desc`

  const { data, loading, error, fetchMore } = useQuery(GET_ISSUES, {
    variables: { jql, pageSize },
    fetchPolicy: 'cache-and-network',
  })

  if (error) return <Error error={error} />

  return (
    <>
      <IssueList
        issues={data.issues && data.issues.issues}
        maxResults={data.issues && data.issues.maxResults}
        total={data.issues && data.issues.total}
        pageSize={pageSize}
        isLoading={loading}
      />
      <Button
        onClick={() =>
          fetchMore({
            variables: {
              after: data.issues.maxResults,
            },
            updateQuery: (prev, { fetchMoreResult, ...rest }) => {
              if (!fetchMoreResult) return prev
              return {
                ...fetchMoreResult,
                issues: {
                  ...fetchMoreResult.issues,
                  issues: [
                    ...prev.issues.issues,
                    ...fetchMoreResult.issues.issues,
                  ],
                },
              }
            },
          })
        }
      >
        Load More
      </Button>
    </>
  )
}
