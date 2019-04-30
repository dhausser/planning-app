import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Spinner from '@atlaskit/spinner'
import EmptyState from '@atlaskit/empty-state'
import ContentWrapper, { Center } from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import BarChart from '../components/BarChart'
import Filters, { LOCAL_STATE_QUERY } from '../components/Filters'

// TEMP
import { defaultFixVersion } from '../credentials'

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
          team
        }
      }
    }
  }
`

export default () => (
  <ContentWrapper>
    <PageTitle>Dashboard</PageTitle>
    <Filters />
    <Query query={LOCAL_STATE_QUERY}>
      {({ data: { versionFilter, teamFilter } }) => (
        <Query
          query={GET_ISSUES}
          variables={{
            jql: `fixVersion = ${
              defaultFixVersion.id
            } AND statusCategory in (new, indeterminate)`,
            pageSize: 1250,
          }}
        >
          {({ data: { issues }, loading: loadingIssues, error }) => {
            if (loadingIssues)
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
                  {issues.maxResults > issues.total
                    ? issues.total
                    : issues.maxResults}{' '}
                  of {issues.total} issues in fixVersion
                </h5>
                <BarChart
                  dataset={
                    teamFilter
                      ? aggregateByAssignee(
                          issues.issues.filter(
                            ({ assignee: { team } }) => team === teamFilter,
                          ),
                        )
                      : aggregateByTeam(issues.issues)
                  }
                />
              </Fragment>
            )
          }}
        </Query>
      )}
    </Query>
  </ContentWrapper>
)

function aggregateByAssignee(issues) {
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

function aggregateByTeam(issues) {
  if (!issues) return []

  return issues.reduce((teams, issue) => {
    if (issue.assignee && issue.assignee.team) {
      const { team: teamName } = issue.assignee
      if (!teams[teamName]) {
        teams[teamName] = 0
      }
      teams[teamName] += 1
    }
    return teams
  }, {})
}
