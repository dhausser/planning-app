import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'

import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productIssuesView } from '../components/Nav'
import { Page, Header, Error, DynamicTable } from '../components'
import { GET_FILTERS, GET_RESOURCES, GET_ISSUES } from '../queries'

function IssuesPage({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(productIssuesView.id)
  }, [navigationViewController])

  const { data: filters } = useQuery(GET_FILTERS)
  const { data: resources } = useQuery(GET_RESOURCES)
  const assignee =
    resources.length &&
    resources.filter(resource => resource.team === filters.team)
  const jql = jqlParser(filters, assignee)

  const { data, loading, error, fetchMore } = useQuery(GET_ISSUES, {
    variables: { jql, startAt: 0, maxResults: 20 },
    fetchPolicy: 'network-only',
  })

  if (error) return <Error error={error} />

  return (
    <Page>
      <Header title="Issues" />
      <DynamicTable {...data.issues} fetchMore={fetchMore} loading={loading} />
    </Page>
  )
}

export default withNavigationViewController(IssuesPage)

export function jqlParser({ project, version }, assignee) {
  return `${project ? `project=${project.id} and ` : ''}${
    version ? `fixVersion in (${version.id}) and ` : ''
  }${
    assignee ? `assignee in (${assignee}) and ` : ''
  }statusCategory in (new, indeterminate) order by priority desc, key asc`
}
