import React from 'react'
import { useQuery } from 'react-apollo-hooks'

import Avatar from '@atlaskit/avatar'

import Page, { NameWrapper, AvatarWrapper } from './Page'
import Issues from './Issues'
import Absences from './Absences'
import Header from './Header'

import { GET_RESOURCE } from './queries'
import { hostname } from '../credentials'

export default function Resource(props) {
  const id = props.match.params.resourceId
  const { data } = useQuery(GET_RESOURCE, {
    variables: { id },
  })
  const name = data.resource
    ? data.resource.name
    : id
        .split('.')
        .map(str => str.charAt(0).toUpperCase() + str.slice(1))
        .join(' ')

  const title = (
    <NameWrapper>
      <AvatarWrapper>
        <Avatar
          name={name}
          size="large"
          src={`https://${hostname}/secure/useravatar?ownerId=${id}`}
        />
      </AvatarWrapper>
      {name}
    </NameWrapper>
  )

  const link = (
    <p>
      <a
        href={`https://${hostname}/issues/?jql=assignee=${id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View in Issue Navigator
      </a>
    </p>
  )

  return (
    <Page>
      <Header title={title} {...props} />
      {link}
      <Issues pageSize={10} {...props} />
      <Absences {...props} />
    </Page>
  )
}
