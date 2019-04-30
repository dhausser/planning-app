import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import ContentWrapper, { Center } from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import IssueList from '../components/IssueList'
import Filters, {
  TEAM_FILTER_QUERY,
  VERSION_FILTER_QUERY,
} from '../components/Filters'
import { projectId } from '../credentials'

export const GET_ISSUES = gql`
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
  return (
    <ContentWrapper>
      <PageTitle>Issues</PageTitle>
      <Filters />
      <Query query={VERSION_FILTER_QUERY}>
        {({ data: { versionId } }) => (
          <Query
            query={GET_ISSUES}
            variables={{
              jql: `project = ${projectId} AND fixVersion = ${versionId} ORDER BY KEY ASC`,
              pageSize: 10,
            }}
          >
            {({ data, loading, error }) => {
              if (loading)
                return (
                  <Center>
                    <Spinner size="large" />
                  </Center>
                )
              if (error)
                return <EmptyState header="Error" description={error.message} />

              const issues = data.issues.issues ? data.issues.issues : []
              return (
                <Query query={TEAM_FILTER_QUERY}>
                  {({ data: { teamFilter } }) => (
                    <IssueList
                      issues={
                        teamFilter
                          ? issues.filter(
                              ({ assignee: { team } }) => team === teamFilter,
                            )
                          : issues
                      }
                      maxResults={data.issues.maxResults}
                      total={data.issues.total}
                      pathname={props.match.path}
                      isLoading={loading}
                    />
                  )}
                </Query>
              )
            }}
          </Query>
        )}
      </Query>
    </ContentWrapper>
  )
}
