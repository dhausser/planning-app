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

  console.log(issue.type)

  return (
    <Grid>
      <GridColumn medium={8}>
        <Summary summary={issue.summary} />
        <a
          href={`https://${hostname}/browse/${issue.key}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View in Issue Navigator
        </a>
        <Description description={issue.description} />
        {/* <Comments comments={issue.comments} /> */}
      </GridColumn>
      <GridColumn medium={4}>
        <p>Status</p>
        <Status
          text={issue.status.name}
          color={getIcon[issue.status.category]}
        />
        <p>Assignee</p>
        {<Assignee assignee={issue.assignee} />}
        <p>FixVersion</p>
        {issue.fixVersions[0] && issue.fixVersions[0].name}
        <p>Type</p>
        {getIcon[issue.type]}
        <p>Priotity</p>
        {getIcon[issue.priority]}
      </GridColumn>
    </Grid>
  )
}
