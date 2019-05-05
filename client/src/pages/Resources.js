import React, { useEffect } from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productHomeView } from '../components/Nav'

import { ResourceList, Page, Header, Error } from '../components'
import { GET_RESOURCES, GET_FILTERS } from '../components/queries'

const ResourcesPage = props => {
  useEffect(() => {
    props.navigationViewController.setView(productHomeView.id)
  }, [props.navigationViewController])

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
    <Page title="People">
      <Header {...props} />
      <ResourceList resources={resources} isLoading={loading} />
    </Page>
  )
}
export default withNavigationViewController(ResourcesPage)
