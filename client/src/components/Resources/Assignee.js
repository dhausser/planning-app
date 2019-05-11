import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@atlaskit/avatar'
import { NameWrapper, AvatarWrapper } from '../Page'

/**
 * TODO: Remove static data dependency
 */
import { hostname } from '../../credentials'

export default ({ assignee }) =>
  assignee ? (
    <NameWrapper>
      <AvatarWrapper>
        <Avatar
          name={assignee.name}
          size="small"
          src={`https://${hostname}/secure/useravatar?ownerId=${assignee.key}`}
        />
      </AvatarWrapper>
      <Link to={`/resource/${assignee.key}`}>{assignee.name}</Link>
    </NameWrapper>
  ) : (
    <NameWrapper>
      <AvatarWrapper>
        <Avatar name="Unassigned" size="large" />
      </AvatarWrapper>
      Unassigned
    </NameWrapper>
  )
