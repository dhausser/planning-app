import React from 'react'
import { useQuery } from 'react-apollo-hooks'

import Error from '../Error'
import IssueList from './IssueList'

import { GET_ISSUES, GET_FILTERS, GET_TEAMS } from '../queries'

export default function Issues(props) {
  const {
    data: { project, version, team },
  } = useQuery(GET_FILTERS)

  const {
    data: { teams },
  } = useQuery(GET_TEAMS)

  let jql = `statusCategory in (new, indeterminate)${
    version ? ` AND fixVersion=${version.id}` : ''
  }${project ? ` AND project=${project.id}` : ''}`

  if (props.match.params.resourceId) {
    jql = `${jql} AND assignee in (${props.match.params.resourceId})`
  } else if (team && teams) {
    const { members } = teams.find(({ _id }) => _id === team.id)
    jql = `${jql} AND assignee in (${members.map(({ key }) => key)})`
  }

  jql = `${jql} ORDER BY key ASC`

  const { data: results, loading, error } = useQuery(GET_ISSUES, {
    variables: { jql, pageSize: props.pageSize },
  })

  if (error) return <Error error={error} />

  let data = {
    issues: {
      issues: [],
      maxResults: 0,
      total: 0,
    },
  }
  if (!loading) data = results

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
