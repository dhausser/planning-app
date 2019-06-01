import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import Avatar from '@atlaskit/avatar'
import Page, { NameWrapper, AvatarWrapper } from '../components/Page'
import {
  ProjectHomeView,
  Header,
  Loading,
  Error,
  DynamicTable,
  AbsencesTable,
} from '../components'
import { GET_RESOURCE, GET_ISSUES } from '../queries'
import { useIssues } from './Issues'
import { host } from '../config'

function ResourcePage(props) {
  useEffect(() => {
    props.navigationViewController.setView(ProjectHomeView.id)
  }, [props.navigationViewController])

  // Extract resource id from url parameters
  const { resourceId } = props.match.params

  // Fetch resource from database
  const { data: resource, loading: loadingResource } = useQuery(GET_RESOURCE, {
    variables: { id: resourceId },
    fetchPolicy: 'cache-first',
  })

  // Fetch issues from REST API
  const [issues, filters] = useIssues(GET_ISSUES, resourceId)
  const { data, loading, error, fetchMore } = issues

  if (loadingResource || loading) return <Loading />

  // Format page title and link
  const { title, link } = formatName(resource, resourceId, filters.version)

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
            src={`https://${host}/secure/useravatar?ownerId=${resourceId}`}
          />
        </AvatarWrapper>
        {name}
      </NameWrapper>
    ),
    link: (
      <p>
        <a
          href={`https://${host}/issues/?jql=assignee=${resourceId}${
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
