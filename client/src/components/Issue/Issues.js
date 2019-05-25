import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import Loading from '../Loading'
import Error from '../Error'
import IssueList from './IssueList'
import { GET_ISSUES, GET_FILTERS, GET_TEAMS } from '../queries'

export default props => {
  const { data, loading, error } = useQuery(GET_FILTERS)

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return <Teams {...props} filters={data} />
}

const Teams = props => {
  const { data, loading, error } = useQuery(GET_TEAMS, {
    fetchPolicy: 'cache-first',
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return <Issues {...props} teams={data.teams} />
}

const Issues = ({ filters, teams, match, pageSize }) => {
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

  const { data: results, loading, error } = useQuery(GET_ISSUES, {
    variables: { jql, pageSize },
    fetchPolicy: 'network-only',
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
      pageSize={pageSize}
      isLoading={loading}
    />
  )
}
