import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { withNavigationViewController } from '@atlaskit/navigation-next'

import { Page, Header, Loading, Error, TableTree } from '../components'
import { projectHomeView } from '../components/Nav'
import { GET_FILTERS, GET_ISSUES, GET_STORIES } from '../components/queries'

function useEpics() {
  const {
    data: { project, version },
  } = useQuery(GET_FILTERS)
  const jql = `issuetype=epic 
  ${project ? `and project=${project.id}` : ''}
  ${version ? `and fixVersion=${version.id}` : ''} order by key asc`

  const { data, loading, error } = useQuery(GET_ISSUES, {
    variables: {
      jql,
    },
    fetchPolicy: 'network-only',
  })

  return [{ data, loading, error }, version]
}

function useStories(epics, version) {
  const jql = `
  ${
    epics.data.issues && epics.data.issues.issues.length
      ? `'Epic Link' in (${epics.data.issues.issues.map(({ id }) => id)}) and `
      : ''
  }
  ${version ? `fixVersion in (${version.id}) and ` : ''}
  issuetype=story
  order by key asc`

  const { data, loading, error } = useQuery(GET_STORIES, {
    variables: {
      jql,
    },
    fetchPolicy: 'network-only',
  })

  return { data, loading, error }
}

function RoadmapPage(props) {
  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  const [epics, version] = useEpics()
  const stories = useStories(epics, version)

  if (epics.loading || stories.loading) return <Loading />
  if (epics.error || stories.error) return <Error />

  console.log({ epics, stories })

  return (
    <Page title="Roadmap">
      <Header {...props} />
      <TableTree epics={epics} stories={stories} />
    </Page>
  )
}
export default withNavigationViewController(RoadmapPage)
