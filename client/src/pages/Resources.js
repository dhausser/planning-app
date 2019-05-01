import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import PageTitle from '../components/PageTitle'
import Filters, { GET_FILTERS } from '../components/Filters'
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

export default () => {
  const { data, loading, error } = useQuery(GET_RESOURCES)
  const {
    data: { team },
  } = useQuery(GET_FILTERS)

  if (loading)
    return (
      <Center>
        <Spinner size="large" />
      </Center>
    )
  if (error) return <EmptyState header="Error" description={error.message} />

  return (
    <ContentWrapper>
      <PageTitle>People</PageTitle>
      <Filters />
      <ResourceList
        resources={
          team
            ? data.resources.filter(resource => resource.team === team)
            : data.resources
        }
        isLoading={loading}
      />
    </ContentWrapper>
  )
}
