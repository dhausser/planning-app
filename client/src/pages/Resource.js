import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import Avatar from '@atlaskit/avatar'
import { projectHomeView } from '../components/Nav'
import Page, { NameWrapper, AvatarWrapper } from '../components/Page'
import {
  Header,
  Loading,
  Error,
  DynamicTable,
  AbsencesTable,
} from '../components'
import { GET_RESOURCE, GET_ISSUES } from '../queries'
import { useIssues } from './Issues'
import { hostname } from '../credentials'

function ResourcePage(props) {
  useEffect(() => {
    props.navigationViewController.setView(projectHomeView.id)
  }, [props.navigationViewController])

  const { resourceId } = props.match.params

  const { data: resource, loading: loadingResource } = useQuery(GET_RESOURCE, {
    variables: { id: resourceId },
  })

  const [issues, filters] = useIssues(GET_ISSUES, resourceId)
  const { data, loading, error, fetchMore } = issues

  const { title, link } =
    !loading && formatName(resource, resourceId, filters.version)

  if (loadingResource || loading) return <Loading />

  return (
    <Page>
      <Header title={title} {...props} />
      {link}
      {error ? (
        <Error error={error} />
      ) : (
        <DynamicTable
          {...data.issues}
          fetchMore={fetchMore}
          loading={loading}
        />
      )}
      <AbsencesTable resourceId={resourceId} />
    </Page>
  )
}

export default withNavigationViewController(ResourcePage)

function formatName({ resource }, resourceId, version) {
  const { name } = resource

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
