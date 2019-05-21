import React from 'react'
import { useQuery } from 'react-apollo-hooks'

import Avatar from '@atlaskit/avatar'

import Page, { NameWrapper, AvatarWrapper } from '../Page'
import Issues from '../Issue/Issues'
import Absences from './Absences'
import Header from '../Header'

import { GET_RESOURCE, GET_FILTERS } from '../queries'

/**
 * TODO: Remove static data dependency
 */
import { hostname } from '../../credentials'

export default function Resource(props) {
  const id = props.match.params.resourceId
  const { data } = useQuery(GET_RESOURCE, {
    variables: { id },
  })
  const {
    data: { version },
  } = useQuery(GET_FILTERS)

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
        href={`https://${hostname}/issues/?jql=assignee=${id}${
          version ? ` AND fixVersion=${version.id}` : ``
        } AND statusCategory != Done order by priority desc`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View in Issue Navigator
      </a>
    </p>
  )

  /**
   * TODO: Implement pagination for issues
   */
  return (
    <Page>
      <Header title={title} {...props} />
      {link}
      <Issues pageSize={20} {...props} />
      <Absences {...props} />
    </Page>
  )
}
