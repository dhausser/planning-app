import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import UserPicker from '@atlaskit/user-picker'
import { host } from '../../config'
import { GET_RESOURCES } from '../../queries'

export default ({ assignee }) => {
  const { data, loading, error } = useQuery(GET_RESOURCES, {
    fetchPolicy: 'cache-first',
  })

  if (loading) return <p>Loading</p>
  if (error) return <p>Error: {error.message}</p>

  const defaultValue = reducer(assignee)
  const options = data.resources.map(resource => reducer(resource)).sort()

  return (
    <UserPicker
      fieldId="example"
      defaultValue={defaultValue}
      options={options}
      onChange={() => { }}
      onInputChange={() => { }}
    />
  )
}

function reducer(user) {
  return {
    id: user.key,
    name: user.name,
    type: 'user',
    fixed: true,
    avatarUrl: `https://${host}/secure/useravatar?ownerId=${user.key}`,
  }
}
