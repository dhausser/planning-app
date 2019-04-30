import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Spinner from '@atlaskit/spinner'
import EmptyState from '@atlaskit/empty-state'
import ContentWrapper, { Center } from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import BarChart from '../components/BarChart'
import Filters, {
  TEAM_FILTER_QUERY,
  VERSION_FILTER_QUERY,
} from '../components/Filters'

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
    <Query query={VERSION_FILTER_QUERY}>
      {({ data: { versionId } }) => (
        <Query
          query={GET_ISSUES}
          variables={{
            jql: `fixVersion = ${versionId} AND statusCategory in (new, indeterminate)`,
            pageSize: 1250,
          }}
        >
          {({ data: { issues }, loading, error }) => {
            if (loading)
              return (
                <Center>
                  <Spinner size="large" />
                </Center>
              )
            if (error)
              return <EmptyState header="Error" description={error.message} />

            return (
              <Query query={TEAM_FILTER_QUERY}>
                {({ data: { teamFilter } }) => (
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
                )}
              </Query>
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
