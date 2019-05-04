import React from 'react'
import { useQuery } from 'react-apollo-hooks'

import Loading from './Loading'
import Error from './Error'
import IssueList from './IssueList'

import { GET_FILTERS } from './Filters'
import { GET_ISSUES } from '../pages/Issues'

import { projectId } from '../credentials'

export default function Issues(props) {
  let jql = ''

  if (projectId) {
    jql = `project=${projectId}`
  }

  if (props.match.params.resourceId) {
    jql = `${jql} AND assignee in (${props.match.params.resourceId})`
  }

  const {
    data: { version },
  } = useQuery(GET_FILTERS)

  if (version && version.id) {
    jql = `${jql} AND fixVersion in (${version.id})`
  }

  const { data, loading, error } = useQuery(GET_ISSUES, {
    variables: { jql, pageSize: props.pageSize },
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  console.log(jql)
  return (
    <IssueList
      issues={data.issues.issues}
      maxResults={data.issues.maxResults}
      total={data.issues.total}
      pathname={props.location.pathname}
      isLoading={loading}
    />
  )
}
