import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { withNavigationViewController } from '@atlaskit/navigation-next'

import { Page, Header, Loading, Error, StoryBoard } from '../components'
import { projectHomeView } from '../components/Nav'
import { GET_FILTERS, GET_ISSUES } from '../components/queries'

function RoadmapPage(props) {
  const {
    data: { project, version },
  } = useQuery(GET_FILTERS)

  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  const jql = `issuetype=epic 
  ${project ? `and project=${project.id}` : ''}
  ${version ? `and fixVersion=${version.id}` : ''} order by key asc`

  const { data, loading, error } = useQuery(GET_ISSUES, {
    variables: {
      jql,
    },
    fetchPolicy: 'network-only',
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return (
    <Page title="Roadmap">
      <Header {...props} />
      <StoryBoard epics={data.issues.issues} />
    </Page>
  )
}
export default withNavigationViewController(RoadmapPage)
