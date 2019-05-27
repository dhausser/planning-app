import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'

import { withNavigationViewController } from '@atlaskit/navigation-next'
import Avatar from '@atlaskit/avatar'
import { projectHomeView } from '../components/Nav'
import Page, { NameWrapper, AvatarWrapper } from '../components/Page'
import { Header, Error, IssuesTable, AbsencesTable } from '../components'
import { GET_FILTERS, GET_RESOURCE, GET_ISSUES } from '../components/queries'

import { hostname } from '../credentials'

export default withNavigationViewController(function ResourcePage(props) {
  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  const { resourceId } = props.match.params
  const pageSize = 20

  const {
    data: { project, version },
  } = useQuery(GET_FILTERS)

  const {
    data: { resource },
  } = useQuery(GET_RESOURCE, {
    variables: { id: resourceId },
  })

  const jql = `${project ? `project=${project.id} and` : ''}\
    ${version ? `fixVersion in (${version.id}) and` : ''}\
    ${resourceId ? `assignee in (${resourceId}) and` : ''}\
    statusCategory in (new, indeterminate)\
    order by priority desc`

  const { data, loading, error, fetchMore } = useQuery(GET_ISSUES, {
    variables: { jql, startAt: 0, maxResults: pageSize },
    fetchPolicy: 'network-only',
  })

  if (error) return <Error error={error} />

  const { title, link } = !loading && formatName(resource, resourceId, version)

  return (
    <Page>
      <Header title={title} {...props} />
      {link}
      <IssuesTable {...data.issues} fetchMore={fetchMore} loading={loading} />
      <AbsencesTable resourceId={resourceId} />
    </Page>
  )
})

function formatName(resource, resourceId, version) {
  const name = resource ? resource.name : ''
  // resourceId
  //   .split('.')
  //   .map(str => str.charAt(0).toUpperCase() + str.slice(1))
  //   .join(' ')

  return {
    title: (
      <NameWrapper>
        <AvatarWrapper>
          <Avatar
            name={name}
            size="large"
            src={`https://${hostname}/secure/useravatar?ownerId=${resourceId}`}
          />
        </AvatarWrapper>
        {name}
      </NameWrapper>
    ),
    link: (
      <p>
        <a
          href={`https://${hostname}/issues/?jql=assignee=${resourceId}${
            version ? ` AND fixVersion=${version.id}` : ``
          } AND statusCategory != Done order by priority desc`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View in Issue Navigator
        </a>
      </p>
    ),
  }
}
