import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import {
  ResourceList,
  Filters,
  ContentWrapper,
  PageTitle,
  Loading,
  Error,
} from '../components'
import { GET_FILTERS } from '../components/Filters'

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
  let resources = []
  if (error) return <Error error={error} />
  if (!loading)
    resources = team
      ? data.resources.filter(resource => resource.team === team)
      : data.resources
  return (
    <ContentWrapper>
      <PageTitle>People</PageTitle>
      <Filters />
      <ResourceList resources={resources} isLoading={loading} />
    </ContentWrapper>
  )
}
