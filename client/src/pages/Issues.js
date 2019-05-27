import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'

import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productIssuesView } from '../components/Nav'
import { Page, Header, Loading, Error, IssuesTable } from '../components'
import { GET_ISSUES, GET_FILTERS, GET_TEAMS } from '../components/queries'

export default withNavigationViewController(function IssuesPage(props) {
  const { data, loading, error } = useQuery(GET_FILTERS)

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return <Teams {...props} filters={data} />
})

function Teams(props) {
  const { data, loading, error } = useQuery(GET_TEAMS, {
    fetchPolicy: 'cache-first',
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return <Issues {...props} teams={data.teams} />
}

function Issues({ navigationViewController, filters, teams }) {
  useEffect(() => {
    navigationViewController.setView(productIssuesView.id)
  }, [navigationViewController])

  const { project, version, team } = filters
  const pageSize = 20

  const assignee =
    team && teams
      ? teams.find(({ _id }) => _id === team.id).members.map(({ key }) => key)
      : null

  const jql = `${project ? `project=${project.id} and` : ''}\
    ${version ? `fixVersion in (${version.id}) and` : ''}\
    ${assignee ? `assignee in (${assignee}) and` : ''}\
    statusCategory in (new, indeterminate)\
    order by priority desc`

  const { data, loading, error, fetchMore } = useQuery(GET_ISSUES, {
    variables: { jql, startAt: 0, maxResults: pageSize },
    fetchPolicy: 'network-only',
  })

  if (error) return <Error error={error} />

  return (
    <Page>
      <Header title="Issues" />
      <IssuesTable {...data.issues} fetchMore={fetchMore} loading={loading} />
    </Page>
  )
}
