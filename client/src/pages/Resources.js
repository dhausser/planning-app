import React, { useEffect } from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productHomeView } from '../components/Nav'

import {
  ResourceList,
  Filters,
  ContentWrapper,
  PageTitle,
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

const Resources = ({ navigationViewController }) => {
  useEffect(() => {
    navigationViewController.setView(productHomeView.id)
  }, [navigationViewController])

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
export default withNavigationViewController(Resources)
