import React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import Avatar from '@atlaskit/avatar'
import UserPicker from '@atlaskit/user-picker'
import { NameWrapper, AvatarWrapper } from '../Page'
import { GET_TEAMS } from '../queries'

/**
 * TODO: Remove static data dependency
 */
import { hostname } from '../../credentials'

export const Assignee = ({ assignee }) => (
  <>
    {assignee ? (
      <NameWrapper>
        <AvatarWrapper>
          <Avatar
            name={assignee.name}
            size="small"
            src={`https://${hostname}/secure/useravatar?ownerId=${
              assignee.key
            }`}
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
    )}
  </>
)

export default ({ assignee }) => (
  <>
    <Query query={GET_TEAMS}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading</p>
        if (error) return <p>Error: {error.message}</p>

        const options = data.teams.map(team => team.members).flat()

        return (
          <UserPicker
            fieldId="example"
            defaultValue={assignee}
            options={options}
            onChange={console.log}
            onInputChange={() => console.log('On change')}
          />
        )
      }}
    </Query>
    {/* <Assignee assignee={assignee} /> */}
  </>
)
