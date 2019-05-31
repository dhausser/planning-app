import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import {
  ProjectHomeView,
  ResourceList,
  Page,
  Header,
  Error,
} from '../components'
import { GET_RESOURCES, GET_FILTERS } from '../queries'

const ResourcesPage = props => {
  useEffect(() => {
    props.navigationViewController.setView(ProjectHomeView.id)
  }, [props.navigationViewController])

  const {
    data: { team },
  } = useQuery(GET_FILTERS)

  const { data, loading, error } = useQuery(GET_RESOURCES, {
    fetchPolicy: 'cache-first',
  })

  let resources = []
  if (error) return <Error error={error} />
  if (!loading)
    resources = team
      ? data.resources.filter(resource => resource.team === team.id)
      : data.resources

  return (
    <Page>
      <Header title="People" {...props} />
      <ResourceList resources={resources} isLoading={loading} />
    </Page>
  )
}
export default withNavigationViewController(ResourcesPage)
