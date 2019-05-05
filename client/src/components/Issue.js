import React from 'react'
import { useQuery } from 'react-apollo-hooks'

import { Grid, GridColumn } from '@atlaskit/page'
import { Status } from '@atlaskit/status'

import { Summary, Loading, Error, Description, Assignee, Comments } from '.'
import { getIcon } from './Icon'

import { GET_ISSUE } from './queries'

import { hostname } from '../credentials'

export default function Issue(props) {
  const {
    data: { issue },
    loading,
    error,
  } = useQuery(GET_ISSUE, {
    variables: { id: props.match.params.issueId },
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return (
    <>
      <Summary summary={issue.summary} />
      <a
        href={`https://${hostname}/browse/${issue.key}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View in Issue Navigator
      </a>
      <h5>Assignee</h5>
      {<Assignee assignee={issue.assignee} />}
      <h5>Status</h5>
      <Status text={issue.status.name} color={getIcon[issue.status.category]} />
      <h5>FixVersion</h5>
      {issue.fixVersions[0] && issue.fixVersions[0].name}
      <h5>Type</h5>
      {getIcon[issue.type]}
      <h5>Priotity</h5>
      {getIcon[issue.priority]}
      <Description description={issue.description} />
      <Comments comments={issue.comments} />
    </>
  )
}
