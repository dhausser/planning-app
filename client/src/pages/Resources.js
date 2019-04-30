import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import PageTitle from '../components/PageTitle'
import Filters, { TEAM_FILTER_QUERY } from '../components/Filters'
import ResourceList from '../components/ResourceList'
import ContentWrapper, { Center } from '../components/ContentWrapper'

const GET_RESOURCES = gql`
  query resourceList {
    resources {
      key
      name
      team
    }
  }
`

export default () => (
  <ContentWrapper>
    <PageTitle>People</PageTitle>
    <Filters />
    <Query query={GET_RESOURCES}>
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
          <Query query={TEAM_FILTER_QUERY}>
            {({ data: { teamFilter } }) => (
              <ResourceList
                resources={
                  teamFilter
                    ? data.resources.filter(
                        resource => resource.team === teamFilter,
                      )
                    : data.resources
                }
                isLoading={loading}
              />
            )}
          </Query>
        )
      }}
    </Query>
  </ContentWrapper>
)
