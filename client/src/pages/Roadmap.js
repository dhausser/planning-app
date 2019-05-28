import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { Status } from '@atlaskit/status'
import { Page, Header, Loading, Error, TableTree } from '../components'
import { projectHomeView } from '../components/Nav'
import Icon from '../components/IssueView/Icon'
import { GET_FILTERS, GET_ISSUES, GET_STORIES } from '../queries'

function RoadmapPage(props) {
  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  let [epics, version] = useEpics()
  let stories = useStories(epics, version)

  if (epics.loading || stories.loading) return <Loading />
  if (epics.error || stories.error) return <Error />

  epics = epics.data.issues.issues
  stories = stories.data.issues.issues

  epics.forEach(issue => {
    issue.children = []
    stories.forEach(child => {
      if (child.parent === issue.key) {
        issue.children.push(child)
      }
    })
  })
  const issues = epics.map(issue => reducer(issue)) || []

  return (
    <Page title="Roadmap">
      <Header {...props} />
      <TableTree issues={issues} />
    </Page>
  )
}
export default withNavigationViewController(RoadmapPage)

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

function reducer(issue) {
  return {
    key: issue.key,
    summary: issue.summary,
    assignee: issue.assignee ? issue.assignee : { key: '', name: 'Unassigned' },
    type: Icon[issue.type],
    priority: Icon[issue.priority],
    status: (
      <Status text={issue.status.name} color={Icon[issue.status.category]} />
    ),
    children: issue.children ? issue.children.map(child => reducer(child)) : [],
  }
}
