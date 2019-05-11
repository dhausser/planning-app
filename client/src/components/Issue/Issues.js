import React from 'react'
import { useQuery } from 'react-apollo-hooks'

import Loading from '../Loading'
import Error from '../Error'
import IssueList from './IssueList'

import { GET_ISSUES, GET_FILTERS, GET_TEAMS } from '../../lib/queries'

/**
 * TODO: Remove static data dependency
 */
import { projectId } from '../../credentials'

export default function Issues(props) {
  const {
    data: { version, team },
  } = useQuery(GET_FILTERS)

  const {
    data: { teams },
  } = useQuery(GET_TEAMS)
  // if (loadingTeams) return <Loading />
  // if (errorTeams) return <Error error={errorTeams} />

  let jql = `statusCategory in (new, indeterminate)
  ${version ? ` AND fixVersion=${version.id}` : ''}
  ${projectId ? ` AND project=${projectId}` : ''}`

  if (props.match.params.resourceId) {
    jql = `${jql} AND assignee in (${props.match.params.resourceId})`
  } else if (team && teams) {
    const { members } = teams.find(({ _id }) => _id === team)
    jql = `${jql} AND assignee in (${members.map(({ key }) => key)})`
  }

  const { data, loading, error } = useQuery(GET_ISSUES, {
    variables: { jql, pageSize: props.pageSize },
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return (
    <IssueList
      issues={data.issues.issues}
      maxResults={data.issues.maxResults}
      total={data.issues.total}
      pageSize={props.pageSize}
      isLoading={loading}
    />
  )
}
