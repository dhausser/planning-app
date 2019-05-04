import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import Loading from './Loading'
import Error from './Error'
import IssueList from './IssueList'

import { GET_FILTERS, GET_TEAMS } from './Filters'

import { projectId } from '../credentials'

const GET_ISSUES = gql`
  query issueList($jql: String, $pageSize: Int!) {
    issues(jql: $jql, pageSize: $pageSize) {
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
          key
          name
          team
        }
      }
    }
  }
`

export default function Issues(props) {
  const {
    data: { version, team },
  } = useQuery(GET_FILTERS)

  const {
    data: { teams },
  } = useQuery(GET_TEAMS)

  let jql = ''

  if (projectId) {
    jql = `project=${projectId}`
  }

  if (props.match.params.resourceId) {
    jql = `${jql} AND assignee in (${props.match.params.resourceId})`
  } else if (team) {
    const { members } = teams.find(({ _id }) => _id === team)
    jql = `${jql} AND assignee in (${members.map(({ key }) => key)})`
  }

  if (version && version.id) {
    jql = `${jql} AND fixVersion in (${version.id})`
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
