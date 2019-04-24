import React, { Fragment, useContext } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Spinner from '@atlaskit/spinner'
import EmptyState from '@atlaskit/empty-state'
import ContentWrapper, { Center } from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import BarChart from '../components/BarChart'
import { FilterContext } from '../context/FilterContext'
import Filters from '../components/Filters'

const GET_ISSUES = gql`
  query issueList($jql: String, $pageSize: Int!) {
    issues(jql: $jql, pageSize: $pageSize) {
      startAt
      maxResults
      total
      issues {
        fixVersions {
          id
          name
        }
        assignee {
          key
          name
        }
      }
    }
  }
`

export default function Dashboard() {
  const { fixVersion } = useContext(FilterContext)
  const jql = `fixVersion = ${
    fixVersion.id
  } AND statusCategory in (new, indeterminate)`
  return (
    <ContentWrapper>
      <PageTitle>Dashboard</PageTitle>
      <Filters />
      <Query query={GET_ISSUES} variables={{ jql, pageSize: 1250 }}>
        {({ data, loading, error }) => {
          if (loading)
            return (
              <Center>
                <Spinner size="large" />
              </Center>
            )
          if (error)
            return <EmptyState header="Error" description={error.message} />

          return (
            <Fragment>
              <h5>
                Displaying{' '}
                {data.issues.maxResults > data.issues.total
                  ? data.issues.total
                  : data.issues.maxResults}{' '}
                of {data.issues.total} issues in fixVersion
              </h5>
              <BarChart dataset={aggregateIssues(data.issues.issues)} />
            </Fragment>
          )
        }}
      </Query>
    </ContentWrapper>
  )
}

function aggregateIssues(issues) {
  if (!issues) return []
  return issues.reduce((resources, issue) => {
    if (issue.assignee && issue.assignee.name) {
      const name = issue.assignee.name.split(' ').shift()
      if (!resources[name]) {
        resources[name] = 0
      }
      resources[name] += 1
    }
    return resources
  }, {})
}
