import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import Avatar from '@atlaskit/avatar'

import Page, { NameWrapper, AvatarWrapper } from './Page'
import Issues from './Issues'
import Absences from './Absences'

import { hostname } from '../credentials'

const GET_RESOURCE = gql`
  query getResourceById($id: ID!) {
    resource(id: $id) {
      key
      name
      team
    }
  }
`

export default function Resource(props) {
  const id = props.match.params.resourceId

  const {
    data: { resource },
  } = useQuery(GET_RESOURCE, {
    variables: { id },
  })

  let assignee
  if (resource) {
    assignee = { ...resource }
  } else {
    assignee = {
      key: id,
      name: id,
      team: '',
    }
  }

  const title = (
    <NameWrapper>
      <AvatarWrapper>
        <Avatar
          name={assignee.name}
          size="large"
          src={`https://${hostname}/secure/useravatar?ownerId=${assignee.key}`}
        />
      </AvatarWrapper>
      {assignee.name}
    </NameWrapper>
  )

  const link = (
    <p>
      <a
        href={`https://${hostname}/issues/?jql=assignee=${assignee.key}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View in Issue Navigator
      </a>
    </p>
  )

  return (
    <Page title={title}>
      {link}
      <Issues {...props} pageSize={10} />
      <Absences {...props} />
    </Page>
  )
}
