import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'

import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productIssuesView } from '../components/Nav'
import { Page, Header, Error, DynamicTable } from '../components'
import { GET_FILTERS, GET_RESOURCES, GET_ISSUES } from '../queries'

function IssuesPage({ navigationViewController }) {
  const { data, loading, error, fetchMore } = useIssues()

  useEffect(() => {
    navigationViewController.setView(productIssuesView.id)
  }, [navigationViewController])

  return (
    <Page>
      <Header title="Issues" />
      {error ? (
        <Error error={error} />
      ) : (
        <DynamicTable
          {...data.issues}
          fetchMore={fetchMore}
          loading={loading}
        />
      )}
    </Page>
  )
}
export default withNavigationViewController(IssuesPage)

/**
 * TODO: Replace jqlParser export by useIssues
 */
export function jqlParser({ project, version }, assignee) {
  return `${project ? `project=${project.id} and ` : ''}${
    version ? `fixVersion in (${version.id}) and ` : ''
  }${
    assignee ? `assignee in (${assignee}) and ` : ''
  }statusCategory in (new, indeterminate) order by priority desc, key asc`
}

export function useIssues() {
  const { data: filters } = useQuery(GET_FILTERS)
  const {
    data: { resources },
    loading,
    error,
  } = useQuery(GET_RESOURCES)

  const assignee =
    !loading &&
    !error &&
    filters.team != null &&
    resources
      .filter(resource => resource.team === filters.team.id)
      .map(resource => resource.key)

  const jql = jqlParser(filters, assignee)

  const issues = useQuery(GET_ISSUES, {
    variables: { jql, startAt: 0, maxResults: 20 },
    fetchPolicy: 'network-only',
  })

  return issues
}
